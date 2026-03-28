'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');

const ROOT = path.join(__dirname, '..');
const PUBLIC_ROOT = path.join(ROOT, 'public');
const UPLOAD_ROOT = path.join(ROOT, 'uploads');
const DATA_FILE = path.join(__dirname, 'data', 'app.json');

['lessons', 'students', 'prospectus', 'gallery'].forEach((d) => {
  fs.mkdirSync(path.join(UPLOAD_ROOT, d), { recursive: true });
});

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function newId() {
  return crypto.randomUUID();
}

const OFFERING_TIERS = ['intermediate', 'degree', 'short'];
const OFFERING_VARIANTS = ['white', 'gradient-emerald', 'gradient-teal', 'boxed'];

const DEFAULT_COURSE_OFFERINGS = [
  {
    tier: 'intermediate',
    title: 'I.Com',
    description:
      'Accounting, commerce, economics, business maths & statistics — BISE Sahiwal. 110 seats (prospectus).',
    linkHref: 'courses.html',
    variant: 'white',
    colSpan: 1,
    footerText: '',
  },
  {
    tier: 'intermediate',
    title: 'ICS',
    description: 'Multiple combinations: CS with Maths/Eco, Stats/Eco, or Stats/Maths — 110 seats.',
    linkHref: 'courses.html',
    variant: 'white',
    colSpan: 1,
    footerText: '',
  },
  {
    tier: 'intermediate',
    title: 'F.A. (IT)',
    description: 'Information technology, Islamiat elective, economics — 1200 marks over two years.',
    linkHref: 'courses.html',
    variant: 'white',
    colSpan: 1,
    footerText: '',
  },
  {
    tier: 'intermediate',
    title: 'D.Com (PBTE)',
    description: '1st shift 135 seats; 2nd shift (boys) 90 seats — light blue shirt in summer for 2nd shift.',
    linkHref: 'courses.html',
    variant: 'white',
    colSpan: 2,
    footerText: '',
  },
  {
    tier: 'degree',
    title: 'BS Commerce',
    description:
      'Eight semesters: management, marketing, finance, e-commerce, taxation, internship & viva — GCUF external finals.',
    linkHref: 'courses.html',
    variant: 'gradient-emerald',
    colSpan: 1,
    footerText: '50 seats · View outlines →',
  },
  {
    tier: 'degree',
    title: 'BS Accounting & Finance',
    description:
      'Professional accounting, audit, corporate finance, Islamic banking, financial modelling, and more.',
    linkHref: 'courses.html',
    variant: 'gradient-teal',
    colSpan: 1,
    footerText: '50 seats · View outlines →',
  },
  {
    tier: 'degree',
    title: 'ADP Commerce',
    description:
      'Two-year associate degree under semester system — 60 seats. Foundation for career entry or lateral progression.',
    linkHref: 'courses.html',
    variant: 'boxed',
    colSpan: 2,
    footerText: '',
  },
  {
    tier: 'short',
    title: 'CCA (6 months)',
    description:
      'Certificate in Computer Applications offered through PBTE Lahore — introduced in 2020. Contact the college office for the latest PBTE session schedule.',
    linkHref: 'courses.html',
    variant: 'white',
    colSpan: 1,
    footerText: '',
  },
];

function seedDefaultCourseOfferings() {
  return DEFAULT_COURSE_OFFERINGS.map((def, idx) => ({
    id: newId(),
    tier: def.tier,
    title: def.title,
    description: def.description,
    linkHref: def.linkHref || '',
    variant: def.variant,
    colSpan: def.colSpan === 2 ? 2 : 1,
    footerText: def.footerText || '',
    sortOrder: idx,
  }));
}

function getCourseOfferingsSorted() {
  const data = loadData();
  if (!Array.isArray(data.courseOfferings)) data.courseOfferings = [];
  if (!data.settings) data.settings = {};
  if (data.courseOfferings.length === 0 && !data.settings.courseOfferingsInitialized) {
    data.courseOfferings = seedDefaultCourseOfferings();
    data.settings.courseOfferingsInitialized = true;
    saveData(data);
  }
  return [...data.courseOfferings].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function offeringToPublic(row) {
  return {
    id: row.id,
    tier: row.tier,
    title: row.title,
    description: row.description || '',
    linkHref: row.linkHref || '',
    variant: row.variant || 'white',
    colSpan: row.colSpan === 2 ? 2 : 1,
    footerText: row.footerText || '',
    sortOrder: Number.isFinite(row.sortOrder) ? row.sortOrder : 0,
  };
}

function validateOfferingPayload(body, partial) {
  if (!body || typeof body !== 'object') return 'Invalid body';
  if (!partial) {
    if (!OFFERING_TIERS.includes(body.tier)) return 'tier must be intermediate, degree, or short';
    if (!String(body.title || '').trim()) return 'Title is required';
    if (!String(body.description || '').trim()) return 'Description is required';
  } else if (body.tier != null && !OFFERING_TIERS.includes(body.tier)) {
    return 'tier must be intermediate, degree, or short';
  }
  if (body.variant != null && !OFFERING_VARIANTS.includes(body.variant)) {
    return 'variant must be white, gradient-emerald, gradient-teal, or boxed';
  }
  if (body.colSpan != null && body.colSpan !== 1 && body.colSpan !== 2) {
    return 'colSpan must be 1 or 2';
  }
  if (body.sortOrder != null && body.sortOrder !== '' && Number.isNaN(Number(body.sortOrder))) {
    return 'sortOrder must be a number';
  }
  return null;
}

function extractYoutubeId(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes('youtu.be')) return u.pathname.replace(/^\//, '').split('/')[0] || null;
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const embed = u.pathname.match(/\/embed\/([^/]+)/);
      if (embed) return embed[1];
      const shorts = u.pathname.match(/\/shorts\/([^/]+)/);
      if (shorts) return shorts[1];
    }
  } catch (_) {
    /* ignore */
  }
  return null;
}

function getProspectusAbsolutePath() {
  const data = loadData();
  const rel = data.settings && data.settings.prospectusRelativePath;
  if (rel) {
    const p = path.join(UPLOAD_ROOT, rel);
    if (fs.existsSync(p)) return p;
  }
  for (const name of ['Prospectus.pdf', 'prospectus.pdf']) {
    const legacy = path.join(PUBLIC_ROOT, name);
    if (fs.existsSync(legacy)) return legacy;
  }
  return null;
}

let fallbackPdfCache = null;
function getFallbackProspectusPdf() {
  if (fallbackPdfCache) return Promise.resolve(fallbackPdfCache);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => {
      fallbackPdfCache = Buffer.concat(chunks);
      resolve(fallbackPdfCache);
    });
    doc.on('error', reject);
    doc.fontSize(16).fillColor('#065f46').text('Government Graduate College of Commerce, Sahiwal', { align: 'center' });
    doc.moveDown();
    doc.fontSize(11).fillColor('#333333').text(
      'No official prospectus PDF has been uploaded to the server yet. This file was generated automatically so the download link never returns an error.',
      { align: 'left' }
    );
    doc.moveDown();
    doc.text('College staff: sign in to Admin → Prospectus and upload the official PDF.', { align: 'left' });
    doc.end();
  });
}

const storageLessons = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(UPLOAD_ROOT, 'lessons')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});

const uploadLesson = multer({
  storage: storageLessons,
  limits: { fileSize: 500 * 1024 * 1024 },
});

const uploadStudentPdf = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(UPLOAD_ROOT, 'students')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.pdf';
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /\.pdf$/i.test(file.originalname) || file.mimetype === 'application/pdf';
    if (ok) cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

const uploadGallery = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(UPLOAD_ROOT, 'gallery')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
});

const uploadProspectus = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(UPLOAD_ROOT, 'prospectus')),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.pdf';
      cb(null, `prospectus${ext}`);
    },
  }),
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /\.pdf$/i.test(file.originalname) || file.mimetype === 'application/pdf';
    if (ok) cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

function publicLessonUrl(rel) {
  if (!rel) return null;
  return `/uploads/${rel.split(path.sep).join('/')}`;
}

function lessonToPublic(row) {
  const base = {
    id: row.id,
    title: row.title,
    description: row.description || '',
    kind: row.kind,
    createdAt: row.createdAt,
  };
  if (row.kind === 'youtube') {
    return { ...base, youtubeId: row.youtubeId, embedUrl: `https://www.youtube-nocookie.com/embed/${row.youtubeId}` };
  }
  if (row.kind === 'file' || row.kind === 'pdf') {
    return { ...base, url: publicLessonUrl(row.fileRel), fileName: row.fileName || '' };
  }
  if (row.kind === 'link') {
    return { ...base, externalUrl: row.externalUrl };
  }
  return base;
}

const app = express();

app.set('trust proxy', 1);

app.use(
  session({
    name: 'ggcc.sid',
    secret: process.env.SESSION_SECRET || 'change-me-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use(express.json({ limit: '1mb' }));

if (!process.env.ADMIN_PASSWORD) {
  console.warn('[ggcc] ADMIN_PASSWORD is not set — using insecure default "admin-change-me"');
}

app.post('/api/auth/login', (req, res) => {
  const expected = process.env.ADMIN_PASSWORD || 'admin-change-me';
  const password = req.body && req.body.password;
  if (password === expected) {
    req.session.admin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/auth/me', (req, res) => {
  res.json({ admin: !!(req.session && req.session.admin) });
});

app.get('/api/prospectus/meta', (req, res) => {
  const abs = getProspectusAbsolutePath();
  res.json({
    viewUrl: '/api/prospectus/file',
    downloadUrl: '/api/prospectus/file?download=1',
    hasOfficialFile: !!abs,
    isPlaceholder: !abs,
  });
});

app.get('/api/prospectus/file', async (req, res, next) => {
  const wantsDownload =
    req.query.download === '1' || req.query.download === 'true' || req.query.dl === '1';
  const filename = 'GGCC-Sahiwal-Prospectus.pdf';
  const placeholderName = 'GGCC-Sahiwal-Prospectus-PLACEHOLDER.pdf';
  try {
    const abs = getProspectusAbsolutePath();
    if (abs) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        wantsDownload
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`
      );
      return res.sendFile(path.resolve(abs), (err) => {
        if (err) next(err);
      });
    }
    const buf = await getFallbackProspectusPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      wantsDownload
        ? `attachment; filename="${placeholderName}"`
        : `inline; filename="${placeholderName}"`
    );
    res.send(buf);
  } catch (e) {
    next(e);
  }
});

app.get('/api/course-offerings', (_req, res) => {
  const list = getCourseOfferingsSorted().map(offeringToPublic);
  res.json(list);
});

app.post('/api/course-offerings', requireAdmin, (req, res) => {
  const err = validateOfferingPayload(req.body, false);
  if (err) return res.status(400).json({ error: err });
  const data = loadData();
  if (!Array.isArray(data.courseOfferings)) data.courseOfferings = [];
  const row = {
    id: newId(),
    tier: req.body.tier,
    title: String(req.body.title).trim(),
    description: String(req.body.description || '').trim(),
    linkHref: String(req.body.linkHref || '').trim(),
    variant: OFFERING_VARIANTS.includes(req.body.variant) ? req.body.variant : 'white',
    colSpan: req.body.colSpan === 2 ? 2 : 1,
    footerText: String(req.body.footerText || '').trim(),
    sortOrder: Number(req.body.sortOrder) || 0,
  };
  data.courseOfferings.push(row);
  saveData(data);
  res.json(offeringToPublic(row));
});

app.post('/api/course-offerings/reset-defaults', requireAdmin, (_req, res) => {
  const data = loadData();
  if (!data.settings) data.settings = {};
  data.courseOfferings = seedDefaultCourseOfferings();
  data.settings.courseOfferingsInitialized = true;
  saveData(data);
  res.json({ ok: true, count: data.courseOfferings.length });
});

app.patch('/api/course-offerings/:id', requireAdmin, (req, res) => {
  const err = validateOfferingPayload(req.body, true);
  if (err) return res.status(400).json({ error: err });
  const data = loadData();
  const list = data.courseOfferings || [];
  const idx = list.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const row = { ...list[idx] };
  if (req.body.tier != null) row.tier = req.body.tier;
  if (req.body.title != null) row.title = String(req.body.title).trim();
  if (req.body.description != null) row.description = String(req.body.description).trim();
  if (req.body.linkHref != null) row.linkHref = String(req.body.linkHref).trim();
  if (req.body.variant != null) row.variant = req.body.variant;
  if (req.body.colSpan != null) row.colSpan = req.body.colSpan === 2 ? 2 : 1;
  if (req.body.footerText != null) row.footerText = String(req.body.footerText).trim();
  if (req.body.sortOrder != null) row.sortOrder = Number(req.body.sortOrder) || 0;
  if (!String(row.title || '').trim()) return res.status(400).json({ error: 'Title is required' });
  if (!OFFERING_TIERS.includes(row.tier)) return res.status(400).json({ error: 'Invalid tier' });
  list[idx] = row;
  data.courseOfferings = list;
  saveData(data);
  res.json(offeringToPublic(row));
});

app.delete('/api/course-offerings/:id', requireAdmin, (req, res) => {
  const data = loadData();
  const list = data.courseOfferings || [];
  const idx = list.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  list.splice(idx, 1);
  data.courseOfferings = list;
  saveData(data);
  res.json({ ok: true });
});

app.get('/api/lessons', (_req, res) => {
  const data = loadData();
  res.json((data.lessons || []).map(lessonToPublic));
});

app.post('/api/lessons', requireAdmin, uploadLesson.single('file'), (req, res) => {
  const title = (req.body.title || '').trim();
  const description = (req.body.description || '').trim();
  const kind = (req.body.kind || '').trim();
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const data = loadData();
  if (!data.lessons) data.lessons = [];

  if (kind === 'youtube') {
    const youtubeUrl = (req.body.youtubeUrl || '').trim();
    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) return res.status(400).json({ error: 'Valid YouTube URL required' });
    const row = {
      id: newId(),
      title,
      description,
      kind: 'youtube',
      youtubeId,
      createdAt: new Date().toISOString(),
    };
    data.lessons.unshift(row);
    saveData(data);
    return res.json(lessonToPublic(row));
  }

  if (kind === 'link') {
    const externalUrl = (req.body.externalUrl || '').trim();
    try {
      // eslint-disable-next-line no-new
      new URL(externalUrl);
    } catch {
      return res.status(400).json({ error: 'Valid URL required' });
    }
    const row = {
      id: newId(),
      title,
      description,
      kind: 'link',
      externalUrl,
      createdAt: new Date().toISOString(),
    };
    data.lessons.unshift(row);
    saveData(data);
    return res.json(lessonToPublic(row));
  }

  if (kind === 'upload' || kind === 'pdf') {
    if (!req.file) return res.status(400).json({ error: 'File is required' });
    const rel = path.join('lessons', req.file.filename).split(path.sep).join('/');
    const ext = path.extname(req.file.filename).toLowerCase();
    const fileKind = ext === '.pdf' || req.file.mimetype === 'application/pdf' ? 'pdf' : 'file';
    const row = {
      id: newId(),
      title,
      description,
      kind: fileKind,
      fileRel: rel,
      fileName: req.file.originalname,
      createdAt: new Date().toISOString(),
    };
    data.lessons.unshift(row);
    saveData(data);
    return res.json(lessonToPublic(row));
  }

  return res.status(400).json({ error: 'Invalid kind' });
});

app.patch('/api/lessons/:id', requireAdmin, uploadLesson.single('file'), (req, res) => {
  const data = loadData();
  const list = data.lessons || [];
  const idx = list.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const row = { ...list[idx] };
  if (req.body.title != null) row.title = String(req.body.title).trim() || row.title;
  if (req.body.description != null) row.description = String(req.body.description).trim();

  if (row.kind === 'youtube' && req.body.youtubeUrl) {
    const youtubeId = extractYoutubeId(req.body.youtubeUrl);
    if (!youtubeId) return res.status(400).json({ error: 'Valid YouTube URL required' });
    row.youtubeId = youtubeId;
  }
  if (row.kind === 'link' && req.body.externalUrl) {
    try {
      new URL(String(req.body.externalUrl).trim());
      row.externalUrl = String(req.body.externalUrl).trim();
    } catch {
      return res.status(400).json({ error: 'Valid URL required' });
    }
  }
  if ((row.kind === 'file' || row.kind === 'pdf') && req.file) {
    const oldRel = row.fileRel;
    const rel = path.join('lessons', req.file.filename).split(path.sep).join('/');
    row.fileRel = rel;
    row.fileName = req.file.originalname;
    const ext = path.extname(req.file.filename).toLowerCase();
    row.kind = ext === '.pdf' || req.file.mimetype === 'application/pdf' ? 'pdf' : 'file';
    if (oldRel) {
      const oldAbs = path.join(UPLOAD_ROOT, oldRel);
      if (fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);
    }
  }

  list[idx] = row;
  data.lessons = list;
  saveData(data);
  res.json(lessonToPublic(row));
});

app.delete('/api/lessons/:id', requireAdmin, (req, res) => {
  const data = loadData();
  const list = data.lessons || [];
  const idx = list.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const row = list[idx];
  if (row.fileRel) {
    const abs = path.join(UPLOAD_ROOT, row.fileRel);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  }
  list.splice(idx, 1);
  data.lessons = list;
  saveData(data);
  res.json({ ok: true });
});

app.get('/api/student-lists', (req, res) => {
  const data = loadData();
  let rows = data.studentLists || [];
  const cat = req.query.category;
  if (cat === 'admission' || cat === 'result') rows = rows.filter((r) => r.category === cat);
  rows = [...rows].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  res.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      sessionYear: r.sessionYear || '',
      pdfUrl: `/uploads/${r.pdfRel.split(path.sep).join('/')}`,
      createdAt: r.createdAt,
    }))
  );
});

app.post('/api/student-lists', requireAdmin, uploadStudentPdf.single('pdf'), (req, res) => {
  const title = (req.body.title || '').trim();
  const category = (req.body.category || '').trim();
  const sessionYear = (req.body.sessionYear || '').trim();
  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (category !== 'admission' && category !== 'result') {
    return res.status(400).json({ error: 'category must be admission or result' });
  }
  if (!req.file) return res.status(400).json({ error: 'PDF file is required' });
  const rel = path.join('students', req.file.filename).split(path.sep).join('/');
  const row = {
    id: newId(),
    title,
    category,
    sessionYear,
    pdfRel: rel,
    createdAt: new Date().toISOString(),
  };
  const data = loadData();
  if (!data.studentLists) data.studentLists = [];
  data.studentLists.unshift(row);
  saveData(data);
  res.json({
    id: row.id,
    title: row.title,
    category: row.category,
    sessionYear: row.sessionYear,
    pdfUrl: `/uploads/${rel}`,
    createdAt: row.createdAt,
  });
});

app.delete('/api/student-lists/:id', requireAdmin, (req, res) => {
  const data = loadData();
  const list = data.studentLists || [];
  const idx = list.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const row = list[idx];
  const abs = path.join(UPLOAD_ROOT, row.pdfRel);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
  list.splice(idx, 1);
  data.studentLists = list;
  saveData(data);
  res.json({ ok: true });
});

app.get('/api/gallery', (req, res) => {
  const data = loadData();
  let rows = data.gallery || [];
  const cat = req.query.category;
  if (cat === 'events' || cat === 'academic') {
    rows = rows.filter((r) => r.category === cat);
  }
  res.json(
    [...rows]
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        imageUrl: `/uploads/${r.imageRel.split(path.sep).join('/')}`,
        createdAt: r.createdAt,
      }))
  );
});

app.post('/api/gallery', requireAdmin, uploadGallery.single('image'), (req, res) => {
  const title = (req.body.title || '').trim();
  const category = (req.body.category || '').trim();
  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (category !== 'events' && category !== 'academic') {
    return res.status(400).json({ error: 'category must be events or academic' });
  }
  if (!req.file) return res.status(400).json({ error: 'Image is required' });
  const rel = path.join('gallery', req.file.filename).split(path.sep).join('/');
  const row = {
    id: newId(),
    title,
    category,
    imageRel: rel,
    createdAt: new Date().toISOString(),
  };
  const data = loadData();
  if (!data.gallery) data.gallery = [];
  data.gallery.unshift(row);
  saveData(data);
  res.json({
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: `/uploads/${rel}`,
    createdAt: row.createdAt,
  });
});

app.delete('/api/gallery/:id', requireAdmin, (req, res) => {
  const data = loadData();
  const list = data.gallery || [];
  const idx = list.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const row = list[idx];
  const abs = path.join(UPLOAD_ROOT, row.imageRel);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
  list.splice(idx, 1);
  data.gallery = list;
  saveData(data);
  res.json({ ok: true });
});

app.post('/api/admin/prospectus', requireAdmin, uploadProspectus.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'PDF file is required' });
  const rel = path.join('prospectus', req.file.filename).split(path.sep).join('/');
  const data = loadData();
  if (!data.settings) data.settings = {};
  const prev = data.settings.prospectusRelativePath;
  if (prev && prev !== rel) {
    const prevAbs = path.join(UPLOAD_ROOT, prev);
    if (fs.existsSync(prevAbs)) fs.unlinkSync(prevAbs);
  }
  data.settings.prospectusRelativePath = rel;
  saveData(data);
  fallbackPdfCache = null;
  res.json({
    ok: true,
    path: rel,
    viewUrl: '/api/prospectus/file',
    downloadUrl: '/api/prospectus/file?download=1',
  });
});

app.use('/uploads', express.static(UPLOAD_ROOT));

app.use((req, res, next) => {
  const p = req.path.split('?')[0];
  if (p === '/server' || p.startsWith('/server/')) {
    return res.status(404).send('Not found');
  }
  next();
});

app.use(express.static(PUBLIC_ROOT));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large' });
  }
  const msg = err.message || 'Server error';
  res.status(500).json({ error: msg });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`GGCC site + API at http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin/`);
});
