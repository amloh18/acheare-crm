// ACHEARE restart-persistence check
// Verifies that data created before a full stack restart still exists after it.
// Usage: node scripts/acheare-restart-check.mjs <companyId> <noteId> <fileId>
const S = 'http://localhost:3000';
const ORIGIN = 'http://localhost:3001';
const [COMPANY_ID, NOTE_ID, FILE_ID] = process.argv.slice(2);

const post = async (path, query, token) => {
  const r = await fetch(S + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), Origin: ORIGIN },
    body: JSON.stringify({ query }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors).slice(0, 200));
  return j.data;
};

const get = async (path, token) => {
  const r = await fetch(S + path, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, j };
};

let fails = 0;
const check = (name, ok, extra = '') => {
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

// re-authenticate (fresh tokens after restart)
const login = await post('/metadata', `mutation { getLoginTokenFromCredentials(email: "tim@apple.dev", password: "tim@apple.dev", origin: "${ORIGIN}") { loginToken { token } } }`);
check('login works after restart', Boolean(login.getLoginTokenFromCredentials.loginToken.token));
const lt = login.getLoginTokenFromCredentials.loginToken.token;
const tok = await post('/metadata', `mutation { getAuthTokensFromLoginToken(loginToken: "${lt}", origin: "${ORIGIN}") { tokens { accessOrWorkspaceAgnosticToken { token } } } }`);
const AT = tok.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;

// user + workspace
const me = await post('/metadata', `query { currentUser { id email } }`, AT);
check('user remains', me.currentUser?.email === 'tim@apple.dev');

// company
const c = await get(`/rest/companies/${COMPANY_ID}`, AT);
check('company remains', c.status === 200 && Boolean(c.j.data?.company), c.j.data?.company?.name || `status ${c.status}`);

// note + link
const n = await get(`/rest/notes/${NOTE_ID}`, AT);
check('note remains', n.status === 200, `status ${n.status}`);
const nt = await get(`/rest/noteTargets?filter=noteId%5Beq%5D%3A${NOTE_ID}`, AT);
check('note→company link remains', (nt.j.data?.noteTargets?.length ?? 0) >= 1, `${nt.j.data?.noteTargets?.length ?? 0} link(s)`);

// uploaded file on disk
const fs = await import('node:fs');
const disk = `${process.env.HOME}/Documents/VScode_projects/PROJECTS/ACHEARE CRM/twenty-upstream/packages/twenty-server/.local-storage`;
const entries = fs.readdirSync(disk, { recursive: true }).map(String);
const found = entries.some((p) => p.includes(FILE_ID));
check('uploaded file remains on disk', found, disk);

process.exit(fails ? 1 : 0);
