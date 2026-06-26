import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { portfolio } from '../src/data/portfolio.ts';

const OUTPUT_DIR = path.resolve('public', 'cv');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'cv-steban-felipe-cuasquer.pdf');

const content = portfolio.es;
const { person } = content;

const colors = {
  ink: '#171111',
  body: '#554443',
  muted: '#7b6865',
  light: '#efe0dc',
  accent: '#d60f1f',
  accentDark: '#99131d',
  panel: '#fff8f6',
};

const margins = { top: 40, bottom: 42, left: 48, right: 48 };
const doc = new PDFDocument({
  size: 'A4',
  margins,
  bufferPages: true,
  compress: false,
  info: {
    Title: 'CV - Steban Felipe Cuasquer Rosero',
    Author: 'Steban Felipe Cuasquer Rosero',
    Subject: person.role,
    Keywords: 'Full-Stack, Web Development, Python, Automation, Data, AI',
  },
});

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
doc.pipe(fs.createWriteStream(OUTPUT_FILE));

const pageWidth = doc.page.width;
const pageHeight = doc.page.height;
const usableWidth = pageWidth - margins.left - margins.right;
const bottomLimit = pageHeight - margins.bottom;

function clean(text = '') {
  return String(text)
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function sentences(text: string, max = 2) {
  const normalized = clean(text).replace(/\n+/g, ' ');
  const parts = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [normalized];
  return parts.slice(0, max).map(clean);
}

function truncate(text: string, maxLength: number) {
  const normalized = clean(text);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).replace(/\s+\S*$/, '')}.`;
}

function setFont(font: string, size: number, color = colors.body) {
  doc.font(font).fontSize(size).fillColor(color);
}

function heightOf(text: string, width = usableWidth, font = 'Helvetica', size = 8.2, lineGap = 1.1) {
  setFont(font, size);
  return doc.heightOfString(clean(text), { width, lineGap });
}

function addPage() {
  doc.addPage();
  doc.y = margins.top;
}

function ensureSpace(height: number) {
  if (doc.y + height > bottomLimit) addPage();
}

function line(y = doc.y) {
  doc
    .moveTo(margins.left, y)
    .lineTo(pageWidth - margins.right, y)
    .lineWidth(0.7)
    .strokeColor(colors.light)
    .stroke();
}

function text(
  textValue: string,
  width = usableWidth,
  font = 'Helvetica',
  size = 8.2,
  color = colors.body,
  lineGap = 1.1,
  align: PDFKit.Mixins.TextOptions['align'] = 'justify',
) {
  setFont(font, size, color);
  doc.text(clean(textValue), margins.left, doc.y, { width, lineGap, align });
}

function bullet(textValue: string, width = usableWidth - 12) {
  const cleaned = clean(textValue);
  const h = heightOf(cleaned, width, 'Helvetica', 7.8, 0.8);
  ensureSpace(h + 6);
  const y = doc.y + 4.2;
  doc.circle(margins.left + 2.3, y, 1.45).fillColor(colors.accent).fill();
  setFont('Helvetica', 7.8, colors.body);
  doc.text(cleaned, margins.left + 11, doc.y, { width, lineGap: 0.8, align: 'justify' });
  doc.y += 1;
}

function itemHeight(params: {
  title: string;
  date?: string;
  meta?: string;
  bullets?: string[];
  tags?: string[];
  body?: string;
}) {
  const titleH = heightOf(params.title, usableWidth, 'Helvetica-Bold', 8.9, 0.8);
  const dateH = params.date ? heightOf(params.date, usableWidth, 'Helvetica-Bold', 7.6, 0.8) : 0;
  const metaH = params.meta ? heightOf(params.meta, usableWidth, 'Helvetica', 7.5, 0.8) : 0;
  const bodyH = params.body ? heightOf(params.body, usableWidth, 'Helvetica', 7.8, 0.8) : 0;
  const bulletsH = (params.bullets ?? []).reduce((total, item) => total + heightOf(item, usableWidth - 12, 'Helvetica', 7.8, 0.8) + 5, 0);
  const tagsH = params.tags?.length ? 14 : 0;
  return titleH + dateH + metaH + bodyH + bulletsH + tagsH + 12;
}

function sectionTitle(title: string, first = false, reserveAfter = 0) {
  ensureSpace(34 + reserveAfter);
  if (!first) doc.y += 3;
  line(doc.y);
  doc.y += 4;
  setFont('Helvetica-Bold', 8.8, colors.accent);
  doc.text(clean(title).toUpperCase(), margins.left, doc.y, {
    width: usableWidth,
    characterSpacing: 1.35,
  });
  doc.y += 5;
}

function drawHeader() {
  doc.rect(0, 0, pageWidth, 18).fill(colors.accentDark);
  doc.rect(0, 18, pageWidth, 3).fill(colors.accent);

  doc.y = margins.top;
  setFont('Helvetica-Bold', 22, colors.ink);
  doc.text(person.fullName, margins.left, doc.y, { width: usableWidth });

  doc.y += 4;
  setFont('Helvetica-Bold', 9.8, colors.accent);
  doc.text(person.role, margins.left, doc.y, { width: usableWidth });

  doc.y += 6;
  setFont('Helvetica', 7.2, colors.muted);
  const contact = [person.email, person.location, person.github, person.linkedin].map(clean).join('  |  ');
  doc.text(contact, margins.left, doc.y, { width: usableWidth, lineGap: 1.2 });

  doc.y += 7;
}

function drawProfile() {
  sectionTitle('Perfil profesional', true);
  const profile = content.profile
    .split('\n\n')
    .map((paragraph) => truncate(paragraph, 250))
    .join(' ');
  const h = heightOf(profile, usableWidth, 'Helvetica', 8.1, 1.1);
  ensureSpace(h + 8);
  text(profile, usableWidth, 'Helvetica', 8.1, colors.body, 1.1);
}

function itemBlock(params: {
  title: string;
  date?: string;
  meta?: string;
  bullets?: string[];
  tags?: string[];
  body?: string;
}) {
  ensureSpace(itemHeight(params));

  setFont('Helvetica-Bold', 8.9, colors.ink);
  doc.text(clean(params.title), margins.left, doc.y, { width: usableWidth, lineGap: 0.8 });

  if (params.date) {
    setFont('Helvetica-Bold', 7.6, colors.accent);
    doc.text(clean(params.date), margins.left, doc.y, { width: usableWidth });
  }

  if (params.meta) {
    text(params.meta, usableWidth, 'Helvetica', 7.5, colors.muted, 0.8, 'left');
  }

  if (params.body) {
    doc.y += 2;
    text(params.body, usableWidth, 'Helvetica', 7.8, colors.body, 0.8, 'justify');
  }

  if (params.bullets) {
    doc.y += 2;
    params.bullets.forEach((item) => bullet(item));
  }

  if (params.tags?.length) {
    doc.y += 1;
    setFont('Helvetica-Bold', 7.1, colors.accent);
    doc.text(params.tags.map(clean).join('  |  '), margins.left, doc.y, { width: usableWidth, lineGap: 0.8, align: 'left' });
  }

  doc.y += 4;
}

function drawExperience() {
  const experienceItems = content.experience.map((item) => ({
      title: item.role,
      date: item.date,
      meta: [item.organization, item.project, item.location].filter(Boolean).join(' | '),
      bullets: sentences(item.description, 1).map((sentence) => truncate(sentence, 190)),
  }));
  sectionTitle('Experiencia profesional', false, experienceItems[0] ? itemHeight(experienceItems[0]) : 0);
  experienceItems.forEach((item) => itemBlock(item));

  const formativeItems = content.formativeExperience.map((item) => ({
      title: item.role,
      date: item.date,
      meta: [item.organization, item.location].filter(Boolean).join(' | '),
      bullets: sentences(item.description, 1).map((sentence) => truncate(sentence, 185)),
  }));
  sectionTitle('Experiencia formativa', false, formativeItems[0] ? itemHeight(formativeItems[0]) : 0);
  formativeItems.forEach((item) => itemBlock(item));
}

function drawEducationAndSkills() {
  const educationItems = content.education.map((item) => ({
      title: item.degree,
      date: item.date,
      meta: [item.institution, item.location].filter(Boolean).join(' | '),
      body: truncate(item.description, 150),
  }));
  sectionTitle('Formación académica', false, educationItems[0] ? itemHeight(educationItems[0]) : 0);
  educationItems.forEach((item) => itemBlock(item));

  sectionTitle('Habilidades técnicas', false, 70);
  const gap = 18;
  const colWidth = (usableWidth - gap) / 2;

  for (let i = 0; i < content.skills.length; i += 2) {
    const left = content.skills[i];
    const right = content.skills[i + 1];
    const leftText = left.items.map(clean).join(' | ');
    const rightText = right ? right.items.map(clean).join(' | ') : '';
    const leftH = 12 + heightOf(leftText, colWidth, 'Helvetica', 7.2, 0.8);
    const rightH = right ? 12 + heightOf(rightText, colWidth, 'Helvetica', 7.2, 0.8) : 0;
    ensureSpace(Math.max(leftH, rightH) + 12);

    const rowY = doc.y;
    setFont('Helvetica-Bold', 8, colors.ink);
    doc.text(clean(left.category), margins.left, rowY, { width: colWidth });
    setFont('Helvetica', 7.2, colors.body);
    doc.text(leftText, margins.left, rowY + 12, { width: colWidth, lineGap: 0.8, align: 'left' });

    if (right) {
      const x = margins.left + colWidth + gap;
      setFont('Helvetica-Bold', 8, colors.ink);
      doc.text(clean(right.category), x, rowY, { width: colWidth });
      setFont('Helvetica', 7.2, colors.body);
      doc.text(rightText, x, rowY + 12, { width: colWidth, lineGap: 0.8, align: 'left' });
    }

    doc.y = rowY + Math.max(leftH, rightH) + 7;
  }
}

function drawProjects() {
  const projectItems = content.projects.map((project) => ({
      title: project.title,
      date: project.code,
      meta: project.technologies.slice(0, 7).join(' | '),
      bullets: [
        truncate(project.description, 165),
        project.role ? `Rol: ${truncate(project.role, 115)}` : '',
      ].filter(Boolean),
  }));
  sectionTitle('Proyectos destacados', false, projectItems[0] ? itemHeight(projectItems[0]) : 0);
  projectItems.forEach((project) => itemBlock(project));
}

function drawPublicationsAndIp() {
  const publicationItems = content.publications.map((publication) => ({
      title: publication.title,
      date: publication.date,
      meta: `${publication.type} | ${publication.venue}`,
      body: publication.authors,
  }));
  sectionTitle('Publicaciones', false, publicationItems[0] ? itemHeight(publicationItems[0]) : 0);
  publicationItems.forEach((publication) => itemBlock(publication));

  const ipItems = content.intellectualProperty.map((item) => ({
      title: item.title,
      date: item.date,
      meta: `${item.type} | ${item.venue}`,
      bullets: [
        ...sentences(item.description, 2).map((sentence) => truncate(sentence, 170)),
        `Rol: ${truncate(item.role, 145)}`,
        `Autores: ${item.authors}`,
      ],
      tags: item.tags,
  }));
  sectionTitle('Propiedad intelectual', false, ipItems[0] ? itemHeight(ipItems[0]) : 0);
  ipItems.forEach((item) => itemBlock(item));
}

drawHeader();
drawProfile();
drawExperience();
drawEducationAndSkills();
drawProjects();
drawPublicationsAndIp();
const totalPages = doc.bufferedPageRange().count;

doc.end();

console.log(`CV generado en ${OUTPUT_FILE} (${totalPages} páginas)`);
