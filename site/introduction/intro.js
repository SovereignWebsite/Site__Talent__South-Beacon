// "Request an introduction" form for an anonymised talent profile (feedback.b, 21 Nov 2026).
// Public on purpose (Dinis, 21 Nov 2026: "a public forum for recruiters is okay"). The lane token in inbox.json can
// only append to the inbox. Each browser makes its own key pair (private halves non-extractable, in IndexedDB),
// signs what it sends and sends its public key, so the inbox can count and answer each browser. The request is
// sealed to the agent's key (sgit hybrid envelope v2) and sent as sws.link/v2, the same format as /send/.
// Nothing about the candidate is asked or sent.
(() => {
  'use strict'
  const $ = s => document.querySelector(s)
  const S = crypto.subtle, te = new TextEncoder(), td = new TextDecoder()
  const b64 = bytes => { let s = ''; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b); return btoa(s) }
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
  const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
  const unpem = pem => unb64(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, ''))
  const say = (t, cls) => { $('#status').textContent = t; $('#status').className = cls || '' }
  const DAY = 864e5
  let CFG = null, ST = null, KEYS = null

  const STORE = () => 'sws-intro:' + CFG.site
  const load = () => { try { return JSON.parse(localStorage.getItem(STORE())) || { items: [] } } catch { return { items: [] } } }
  const save = () => { try { localStorage.setItem(STORE(), JSON.stringify(ST)) } catch { } }
  const idb = () => new Promise((ok, no) => { const r = indexedDB.open('sws-send', 1); r.onupgradeneeded = () => r.result.createObjectStore('keys'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error) })
  const tx = async (mode, fn) => { const db = await idb(); return new Promise((ok, no) => { const t = db.transaction('keys', mode), r = fn(t.objectStore('keys')); t.oncomplete = () => ok(r && r.result); t.onerror = () => no(t.error) }) }

  async function browserKeys() {
    const name = 'me:' + CFG.site
    let k = await tx('readonly', s => s.get(name))
    if (!k) {
      const sig = await S.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify'])
      const enc = await S.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits'])
      const pub = { sign: await S.exportKey('jwk', sig.publicKey), enc: await S.exportKey('jwk', enc.publicKey) }
      for (const j of [pub.sign, pub.enc]) { delete j.key_ops; delete j.ext }
      const fp = hex(await S.digest('SHA-256', await S.exportKey('spki', sig.publicKey))).slice(0, 16)
      k = { sig: sig.privateKey, enc: enc.privateKey, pub, fp, made: new Date().toISOString() }
      await tx('readwrite', s => s.put(k, name))
    }
    return k
  }

  async function seal(pem, text) {
    const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
    const aes = await S.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const c = await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, te.encode(text))
    const w = await S.encrypt({ name: 'RSA-OAEP' }, pub, await S.exportKey('raw', aes))
    return btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) }))
  }

  async function openReply(env) {
    const epk = await S.importKey('jwk', env.epk, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
    const bits = await S.deriveBits({ name: 'ECDH', public: epk }, KEYS.enc, 256)
    const hk = await S.importKey('raw', bits, 'HKDF', false, ['deriveKey'])
    const key = await S.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode('ws-ecies-1') }, hk, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
    return JSON.parse(td.decode(await S.decrypt({ name: 'AES-GCM', iv: unb64(env.iv) }, key, unb64(env.ct))))
  }

  const val = id => $('#' + id).value.trim()
  async function send() {
    const form = { name: val('name'), organisation: val('org'), contact: val('contact'), role: val('role'), message: val('text') }
    const miss = [['name', 'your name'], ['organisation', 'your organisation'], ['contact', 'how to reach you'], ['role', 'the role']].filter(([k]) => !form[k]).map(([, l]) => l)
    if (miss.length) return say('Please add ' + miss.join(', ') + '.', 'bad')
    const recent = ST.items.filter(i => Date.now() - Date.parse(i.time) < DAY).length
    if (recent >= (CFG.cap_per_day || 3)) return say('This device has sent the most requests allowed today. Please try again tomorrow.', 'bad')
    $('#send').disabled = true; say('Encrypting and sending…')
    try {
      const fp = hex(await S.digest('SHA-256', unpem(CFG.recipient.encrypt))).slice(0, 16)
      if ('sha256:' + fp !== CFG.recipient.fingerprint) throw new Error("the agent's key on this page does not match its fingerprint")
      const id = hex(crypto.getRandomValues(new Uint8Array(8)))
      const text = `Introduction request\nName: ${form.name}\nOrganisation: ${form.organisation}\nContact: ${form.contact}\nRole: ${form.role}` + (form.message ? `\n\n${form.message}` : '')
      const items_json = JSON.stringify({ type: 'sws.link/v2', kind: 'introduction-request', id, site: CFG.site, page: location.pathname, sent_at: new Date().toISOString(), form, text })
      const sig = await S.sign({ name: 'ECDSA', hash: 'SHA-256' }, KEYS.sig, te.encode(items_json))
      const outer = { type: 'sws.link/v2', site: CFG.site, browser: { fp: KEYS.fp, sign: KEYS.pub.sign, enc: KEYS.pub.enc },
                      signed: { alg: 'ECDSA-P256-SHA256-P1363', sig: b64(sig) }, items_json }
      const r = await fetch(`${CFG.endpoint}/api/vault/append/write/${CFG.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ append_token: CFG.append_token, payload: btoa(await seal(CFG.recipient.encrypt, JSON.stringify(outer))) }), credentials: 'omit' })
      if (r.status === 404) throw new Error('requests are closed for now')
      if (!r.ok) throw new Error(r.status === 413 ? 'the request is too long' : `the inbox answered ${r.status}`)
      ST.items.unshift({ id, time: new Date().toISOString(), preview: `${form.role} (${form.organisation})`.slice(0, 200), state: 'sent' }); save()
      for (const i of ['name', 'org', 'contact', 'role', 'text']) $('#' + i).value = ''
      say(''); $('#form').hidden = true; $('#thanks').hidden = false; render(); $('#thanks').focus?.()
    } catch (e) { say('Not sent: ' + e.message + '.', 'bad') } finally { $('#send').disabled = false }
  }

  async function refresh() {
    if (!ST.items.length) return
    try {
      const r = await fetch(`replies/${KEYS.fp}.json`, { cache: 'no-store' }); if (!r.ok) return
      for (const env of await r.json()) {
        try {
          const m = await openReply(env), it = ST.items.find(i => i.id === m.re_id)
          if (it && ['received', 'acted on', 'answered'].includes(m.state)) { it.state = m.state; it.at = m.at }
        } catch { }
      }
      save(); render()
    } catch { }
  }

  const LABEL = { 'sent': 'Sent', 'received': 'Received', 'acted on': 'Passed to the candidate', 'answered': 'Answered' }
  const when = t => { try { return new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) } catch { return t } }
  function render() {
    const ol = $('#sent'); ol.replaceChildren(); $('#history').hidden = !ST.items.length
    for (const it of ST.items) {
      const li = document.createElement('li')
      const p = document.createElement('p'); p.textContent = it.preview
      const m = document.createElement('p'); m.className = 'when'
      const st = document.createElement('span'); st.className = 'state s-' + it.state.replace(' ', '-'); st.textContent = LABEL[it.state] || it.state
      m.append(when(it.time) + ' · ', st, it.at && it.state !== 'sent' ? ' ' + when(it.at) : '')
      li.append(p, m); ol.append(li)
    }
  }

  async function main() {
    try { CFG = await (await fetch('inbox.json', { cache: 'no-store' })).json() } catch { return say('This page could not load its settings.', 'bad') }
    ST = load(); $('#cap').textContent = CFG.cap_per_day || 3
    try { KEYS = await browserKeys() } catch { $('#send').disabled = true; return say('This browser cannot keep a key (private window?). Please try a normal window.', 'bad') }
    $('#device').textContent = KEYS.fp
    $('#send').addEventListener('click', send)
    $('#another').addEventListener('click', () => { $('#thanks').hidden = true; $('#form').hidden = false; $('#name').focus() })
    $('#forget').addEventListener('click', async () => {
      try { localStorage.removeItem(STORE()) } catch { }
      try { await tx('readwrite', s => s.delete('me:' + CFG.site)) } catch { }
      location.reload()
    })
    render(); refresh()
    setInterval(refresh, 60000)
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh() })
  }
  main()
})()
