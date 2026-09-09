/**
 * ACHEARE CRM — local end-to-end test suite (final)
 *
 * Covers: authentication (valid/invalid login, currentUser, signOut),
 * CRM record CRUD, relationships, notes, search/filter, local file upload
 * (createFileUpload → PUT → completeFileUpload → read-back → on-disk check).
 *
 * Usage:  node scripts/acheare-e2e-test.mjs
 * Needs:  server on :3000, dev-seeded user tim@apple.dev / tim@apple.dev
 * Result: exit 0 when all checks pass. Keeps the company + note + uploaded
 *         file behind for restart-persistence verification.
 */
const SERVER = 'http://localhost:3000';
const ORIGIN = 'http://localhost:3001';
const EMAIL = 'tim@apple.dev';
const PASSWORD = 'tim@apple.dev';
const RUN = Date.now().toString(36);

const results = [];
const check = (name, ok, extra = '') => {
  results.push({ name, ok, extra });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const gql = async (path, query, token) => {
  const res = await fetch(`${SERVER}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Origin: ORIGIN,
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
};

const rest = async (path, options = {}, token) => {
  const res = await fetch(`${SERVER}/rest${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json).slice(0, 200)}`);
  return json;
};

// ================================================================ 1. AUTH
console.log('== 1. Authentication ==');

// invalid login must be rejected
let invalidRejected = false;
let invalidMsg = '';
try {
  await gql('/metadata', `mutation { getLoginTokenFromCredentials(email: "${EMAIL}", password: "wrong-password", origin: "${ORIGIN}") { loginToken { token } } }`);
} catch (e) {
  invalidRejected = true;
  invalidMsg = e.message.slice(0, 60);
}
check('invalid login rejected', invalidRejected, invalidMsg);

// valid login → loginToken → access + refresh tokens
const { getLoginTokenFromCredentials: login } = await gql(
  '/metadata',
  `mutation { getLoginTokenFromCredentials(email: "${EMAIL}", password: "${PASSWORD}", origin: "${ORIGIN}") { loginToken { token expiresAt } } }`,
);
check('valid login → loginToken', Boolean(login.loginToken.token));

const { getAuthTokensFromLoginToken: tokenPair } = await gql(
  '/metadata',
  `mutation { getAuthTokensFromLoginToken(loginToken: "${login.loginToken.token}", origin: "${ORIGIN}") { tokens { accessOrWorkspaceAgnosticToken { token } refreshToken { token } } } }`,
);
const TOKEN = tokenPair.tokens.accessOrWorkspaceAgnosticToken.token;
const REFRESH = tokenPair.tokens.refreshToken.token;
check('loginToken → access + refresh tokens', Boolean(TOKEN && REFRESH));

// unauthenticated request rejected
const unauth = await fetch(`${SERVER}/rest/companies`);
check('unauthenticated REST rejected', unauth.status === 401 || unauth.status === 403, `status ${unauth.status}`);

// session resolves
const me = await gql('/metadata', `query { currentUser { id email } }`, TOKEN);
check('currentUser resolves', me.currentUser?.email === EMAIL, me.currentUser?.email);

// ================================================================ 2. CRUD
console.log('== 2. Company / Person / Opportunity CRUD ==');
const company = await rest('/companies', { method: 'POST', body: JSON.stringify({ name: `Test Client Ltd ${RUN}` }) }, TOKEN);
const COMPANY_ID = company.data.createCompany.id;
check('create company', Boolean(COMPANY_ID));

const companyUpd = await rest(`/companies/${COMPANY_ID}`, { method: 'PATCH', body: JSON.stringify({ name: `Test Client Ltd (updated) ${RUN}` }) }, TOKEN);
check('update company', companyUpd.data.updateCompany.name === `Test Client Ltd (updated) ${RUN}`);

const companyRead = await rest(`/companies/${COMPANY_ID}`, {}, TOKEN);
check('read company', companyRead.data.company.id === COMPANY_ID);

const person = await rest('/people', {
  method: 'POST',
  body: JSON.stringify({ name: { firstName: 'Test', lastName: 'Contact' }, emails: { primaryEmail: `test.contact.${RUN}@example.com` }, companyId: COMPANY_ID }),
}, TOKEN);
const PERSON_ID = person.data.createPerson.id;
check('create person', Boolean(PERSON_ID));

const personRead = await rest(`/people/${PERSON_ID}`, {}, TOKEN);
check('read person', personRead.data.person.id === PERSON_ID);

const personUpd = await rest(`/people/${PERSON_ID}`, { method: 'PATCH', body: JSON.stringify({ jobTitle: 'QA Lead' }) }, TOKEN);
check('update person', personUpd.data.updatePerson.jobTitle === 'QA Lead');

const opp = await rest('/opportunities', {
  method: 'POST',
  body: JSON.stringify({ name: `First Deal ${RUN}`, stage: 'SCREENING', amount: { amountMicros: 5000000000, currencyCode: 'USD' } }),
}, TOKEN);
const OPP_ID = opp.data.createOpportunity.id;
check('create opportunity', Boolean(OPP_ID), opp.data.createOpportunity.stage);

const oppUpd = await rest(`/opportunities/${OPP_ID}`, { method: 'PATCH', body: JSON.stringify({ stage: 'MEETING' }) }, TOKEN);
check('update opportunity stage', oppUpd.data.updateOpportunity.stage === 'MEETING');

// ================================================================ 3. RELATIONSHIPS
console.log('== 3. Relationships ==');
const personRel = await rest(`/people/${PERSON_ID}`, {}, TOKEN);
check('person → company (companyId)', personRel.data.person.companyId === COMPANY_ID);

const oppLink = await rest(`/opportunities/${OPP_ID}`, { method: 'PATCH', body: JSON.stringify({ pointOfContactId: PERSON_ID }) }, TOKEN);
check('opportunity → person (pointOfContactId)', oppLink.data.updateOpportunity.pointOfContactId === PERSON_ID);

// ================================================================ 4. NOTES
console.log('== 4. Notes ==');
const note = await rest('/notes', {
  method: 'POST',
  body: JSON.stringify({
    title: `Kickoff note ${RUN}`,
    bodyV2: {
      blocknote: JSON.stringify([{ type: 'paragraph', content: [{ type: 'text', text: 'Agreed scope with the client.' }] }]),
      markdown: 'Agreed scope with the client.',
    },
  }),
}, TOKEN);
const NOTE_ID = note.data.createNote.id;
check('create note', Boolean(NOTE_ID));

const noteLink = await rest('/noteTargets', { method: 'POST', body: JSON.stringify({ noteId: NOTE_ID, targetCompanyId: COMPANY_ID }) }, TOKEN);
check('associate note with company (noteTargets)', noteLink.data.createNoteTarget.targetCompanyId === COMPANY_ID);

const noteRead = await rest(`/notes/${NOTE_ID}`, {}, TOKEN);
check('read note', noteRead.data.note.title === `Kickoff note ${RUN}`);

// ================================================================ 5. SEARCH & FILTER
console.log('== 5. Search & filter ==');
const search = await gql(
  '/graphql',
  `query { search(searchInput: "${`Test Client Ltd ${RUN}`}", limit: 10) { edges { node { recordId objectNameSingular label } } } }`,
  TOKEN,
);
const searchHit = search.search?.edges?.some((e) => e.node.recordId === COMPANY_ID);
check('search finds company', Boolean(searchHit), `${search.search?.edges?.length ?? 0} hit(s)`);

const filtered = await rest(`/companies?filter=name%5Bilike%5D%3A%25${encodeURIComponent(`Test Client`)}%25`, {}, TOKEN);
check('filter companies by name', (filtered.data?.companies?.length ?? 0) >= 1, `${filtered.data?.companies?.length ?? 0} result(s)`);

// ================================================================ 6. FILES
console.log('== 6. File upload (local storage) ==');
// reuse (or create once) a dedicated FILES field on company — idempotent across runs
let FIELD_ID = null;
try {
  let cursor = null;
  for (let i = 0; i < 30; i++) {
    const paging = cursor ? `paging: { first: 200, after: "${cursor}" }` : 'paging: { first: 200 }';
    const d = await gql('/metadata', `query { fields(${paging}) { edges { node { id name } } pageInfo { hasNextPage endCursor } } }`, TOKEN);
    FIELD_ID = d.fields.edges.map((e) => e.node).find((n) => n.name === 'testDocs')?.id;
    if (FIELD_ID || !d.fields.pageInfo.hasNextPage) break;
    cursor = d.fields.pageInfo.endCursor;
  }
} catch { /* fall through to create */ }
if (!FIELD_ID) {
  const { createOneField: newField } = await gql(
    '/metadata',
    `mutation { createOneField(input: { field: { type: FILES, name: "testDocs", label: "Test Docs", description: "E2E storage verification field", objectMetadataId: "2f06d4ac-09d6-4498-bf93-ead0d944a45b", settings: { maxNumberOfValues: 10 } } }) { id name } }`,
    TOKEN,
  );
  FIELD_ID = newField.id;
}
check('FILES field available for upload test', Boolean(FIELD_ID), FIELD_ID);

const FILE_CONTENT = `ACHEARE local storage test ${RUN}`;
const FILE_SIZE = Buffer.byteLength(FILE_CONTENT);
const { createFileUpload: target } = await gql(
  '/metadata',
  `mutation { createFileUpload(filename: "acheare-e2e-${RUN}.txt", size: ${FILE_SIZE}, fileFolder: FilesField, fieldMetadataId: "${FIELD_ID}") { fileId uploadUrl contentType } }`,
  TOKEN,
);
check('createFileUpload → upload target', Boolean(target.fileId && target.uploadUrl));

const put = await fetch(target.uploadUrl, { method: 'PUT', headers: { 'Content-Type': target.contentType || 'text/plain' }, body: FILE_CONTENT });
check('PUT file to uploadUrl', put.ok, `status ${put.status}`);

const completed = await gql('/metadata', `mutation { completeFileUpload(fileId: "${target.fileId}") { id path size } }`, TOKEN).catch((e) => ({ err: e.message }));
check('completeFileUpload', Boolean(completed.completeFileUpload), completed.err || '');

// GET /file/:folder/:id requires a file token whose payload.fileId matches (FileByIdGuard);
// reuse the short-lived token embedded in the uploadUrl. Folder segment is kebab-case
// (FileFolder.FilesField = 'files-field').
const fileToken = new URL(target.uploadUrl).searchParams.get('token');
check('uploadUrl carries file token', Boolean(fileToken));
const back = await fetch(`${SERVER}/file/files-field/${target.fileId}?token=${fileToken}`);
const backText = back.ok ? await back.text() : '';
check('file readable back (GET /file/FilesField/:id?token=…)', back.ok && backText === FILE_CONTENT, `status ${back.status}`);

// on-disk location (local driver: STORAGE_LOCAL_PATH=.local-storage)
const diskPath = `/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/twenty-upstream/packages/twenty-server/.local-storage`;
let onDisk = false;
try { onDisk = (await import('node:fs')).readdirSync(diskPath, { recursive: true }).some((p) => String(p).includes(target.fileId)); } catch { /* ignore */ }
check('file exists in local storage dir', onDisk, diskPath);

// ================================================================ 7. DELETE / CLEANUP
console.log('== 7. Delete & cleanup ==');
await rest(`/opportunities/${OPP_ID}`, { method: 'DELETE' }, TOKEN);
check('delete opportunity', true);
await rest(`/people/${PERSON_ID}`, { method: 'DELETE' }, TOKEN);
check('delete person', true);
// company + note kept for restart-persistence verification

// signOut (validates logout endpoint; access token stays valid until expiry — expected JWT behaviour)
const signedOut = await gql('/metadata', `mutation { signOut(refreshToken: "${REFRESH}") }`, TOKEN);
check('signOut returns true', signedOut.signOut === true);

// ================================================================ summary
const failed = results.filter((r) => !r.ok);
console.log('\n========================================');
console.log(`TOTAL: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`);
failed.forEach((r) => console.log(`  FAIL: ${r.name} ${r.extra}`));
console.log(`\nKept for restart test: company=${COMPANY_ID} note=${NOTE_ID} file=${target.fileId}`);
process.exit(failed.length ? 1 : 0);
