const fs = require('fs');
const base = process.argv[2];
const email = process.argv[3];
const pass = process.argv[4];
if (!base || !email || !pass) {
  console.error('Missing base/email/pass');
  process.exit(1);
}
(async () => {
  const loginRes = await fetch(base + '/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'device-name': 'GuestSnapshot',
      'device-id': 'guest-snapshot',
    },
    body: JSON.stringify({ email, password: pass }),
  });
  if (!loginRes.ok) throw new Error('login failed ' + loginRes.status);
  const loginJson = await loginRes.json();
  const token = loginJson?.data?.token;
  if (!token) throw new Error('no token');
  const headers = { authorization: 'Bearer ' + token };
  const [subjects, classes, chapters, freeTopics] = await Promise.all([
    fetch(base + '/api/v1/subjects', { headers }).then((r) => r.json()),
    fetch(base + '/api/v1/classes', { headers }).then((r) => r.json()),
    fetch(base + '/api/v1/chapters', { headers }).then((r) => r.json()),
    fetch(base + '/api/v1/topics/free', { headers }).then((r) => r.json()),
  ]);
  const data = {
    generatedAt: new Date().toISOString(),
    baseUrl: base,
    subjects: subjects.data || [],
    classes: classes.data || [],
    chapters: chapters.data || [],
    freeTopics: freeTopics.data || [],
  };
  fs.writeFileSync('src/constants/guestData.json', JSON.stringify(data, null, 2));
  console.log('Wrote src/constants/guestData.json');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
