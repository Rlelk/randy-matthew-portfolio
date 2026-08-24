require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const cvData = require('./cv-data.json');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN tidak ditemukan di .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Rate limiting sederhana (anti-spam)
const userLastMessage = new Map();
const RATE_LIMIT_MS = 2000;

function rateLimit(ctx, next) {
  const userId = ctx.from.id;
  const now = Date.now();
  const last = userLastMessage.get(userId) || 0;
  
  if (now - last < RATE_LIMIT_MS) {
    return ctx.reply('⏳ Tunggu sebentar... (rate limit)');
  }
  userLastMessage.set(userId, now);
  return next();
}

bot.use(rateLimit);

// Helper: format CV sections
function formatAbout() {
  return `👤 *${cvData.name}*\n📍 ${cvData.location} | 📞 ${cvData.phone} | 📧 ${cvData.email}\n🔗 LinkedIn: ${cvData.linkedin}\n\n${cvData.about}`;
}

function formatEducation() {
  let text = '🎓 *Pendidikan*\n\n';
  cvData.education.forEach((edu, i) => {
    text += `${i + 1}. *${edu.institution}* (${edu.period})\n`;
    text += `   ${edu.degree}`;
    if (edu.gpa) text += ` | GPA: ${edu.gpa}`;
    text += '\n';
    if (edu.thesis) text += `   📝 Thesis: ${edu.thesis}\n`;
    if (edu.details) {
      edu.details.forEach(d => text += `   • ${d}\n`);
    }
    text += '\n';
  });
  return text;
}

function formatExperience() {
  let text = '💼 *Pengalaman Kerja*\n\n';
  cvData.experience.forEach((exp, i) => {
    text += `${i + 1}. *${exp.role}* di ${exp.company}\n`;
    text += `   📅 ${exp.period}\n`;
    text += `   ${exp.description}\n`;
    exp.achievements.forEach(a => text += `   ✅ ${a}\n`);
    text += '\n';
  });
  return text;
}

function formatProjects() {
  let text = '🚀 *Project*\n\n';
  cvData.projects.forEach((proj, i) => {
    text += `${i + 1}. *${proj.name}*\n`;
    text += `   📋 ${proj.type}\n`;
    text += `   ${proj.description}\n`;
    if (proj.tech) text += `   🛠 ${proj.tech}\n`;
    text += '\n';
  });
  return text;
}

function formatSkills() {
  let text = '🛠 *Keahlian*\n\n';
  text += '*Technical:*\n';
  cvData.skills.technical.forEach(s => text += `• ${s}\n`);
  text += '\n*Soft Skills:*\n';
  cvData.skills.soft.forEach(s => text += `• ${s}\n`);
  text += '\n*Bahasa:*\n';
  cvData.skills.languages.forEach(l => text += `• ${l}\n`);
  return text;
}

function formatCertifications() {
  let text = '📜 *Sertifikasi*\n\n';
  cvData.certifications.forEach((cert, i) => {
    text += `${i + 1}. ${cert.name}`;
    if (cert.date) text += ` (${cert.date})`;
    text += '\n';
  });
  return text;
}

function formatTargetRoles() {
  let text = '🎯 *Target Posisi*\n\n';
  cvData.target_roles.forEach(r => text += `• ${r}\n`);
  return text;
}

function formatFullCV() {
  return [
    formatAbout(),
    '━━━━━━━━━━━━━━━━━━',
    formatEducation(),
    '━━━━━━━━━━━━━━━━━━',
    formatExperience(),
    '━━━━━━━━━━━━━━━━━━',
    formatProjects(),
    '━━━━━━━━━━━━━━━━━━',
    formatSkills(),
    '━━━━━━━━━━━━━━━━━━',
    formatCertifications(),
    '━━━━━━━━━━━━━━━━━━',
    formatTargetRoles()
  ].join('\n');
}

// Keyboard menu
const mainKeyboard = Markup.keyboard([
  ['👤 Tentang Saya', '🎓 Pendidikan'],
  ['💼 Pengalaman', '🚀 Project'],
  ['🛠 Keahlian', '📜 Sertifikasi'],
  ['🎯 Target Posisi', '📄 CV Lengkap']
]).resize().oneTime();

// Commands
bot.start(ctx => {
  const name = ctx.from.first_name || 'User';
  ctx.reply(
    `Halo ${name}! 👋\n\nSaya bot CV *${cvData.name}*. Tanyakan apa saja tentang profil, pengalaman, skill, atau project saya.\n\nAtau pilih menu di bawah:`,
    { parse_mode: 'Markdown', ...mainKeyboard }
  );
});

bot.help(ctx => {
  ctx.reply(
    `*Perintah tersedia:*\n` +
    `/start - Mulai & tampilkan menu\n` +
    `/cv - Kirim CV lengkap\n` +
    `/about - Tentang saya\n` +
    `/education - Pendidikan\n` +
    `/experience - Pengalaman kerja\n` +
    `/projects - Project\n` +
    `/skills - Keahlian\n` +
    `/certs - Sertifikasi\n` +
    `/target - Target posisi\n` +
    `/contact - Info kontak\n` +
    `/help - Bantuan ini`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('cv', ctx => ctx.reply(formatFullCV(), { parse_mode: 'Markdown' }));
bot.command('about', ctx => ctx.reply(formatAbout(), { parse_mode: 'Markdown' }));
bot.command('education', ctx => ctx.reply(formatEducation(), { parse_mode: 'Markdown' }));
bot.command('experience', ctx => ctx.reply(formatExperience(), { parse_mode: 'Markdown' }));
bot.command('projects', ctx => ctx.reply(formatProjects(), { parse_mode: 'Markdown' }));
bot.command('skills', ctx => ctx.reply(formatSkills(), { parse_mode: 'Markdown' }));
bot.command('certs', ctx => ctx.reply(formatCertifications(), { parse_mode: 'Markdown' }));
bot.command('target', ctx => ctx.reply(formatTargetRoles(), { parse_mode: 'Markdown' }));

bot.command('contact', ctx => {
  ctx.reply(
    `📞 *Kontak ${cvData.name}*\n\n` +
    `📱 ${cvData.phone}\n` +
    `📧 ${cvData.email}\n` +
    `🔗 LinkedIn: ${cvData.linkedin}\n` +
    `📍 ${cvData.location}`,
    { parse_mode: 'Markdown' }
  );
});

// Keyboard button handlers
bot.hears('👤 Tentang Saya', ctx => ctx.reply(formatAbout(), { parse_mode: 'Markdown' }));
bot.hears('🎓 Pendidikan', ctx => ctx.reply(formatEducation(), { parse_mode: 'Markdown' }));
bot.hears('💼 Pengalaman', ctx => ctx.reply(formatExperience(), { parse_mode: 'Markdown' }));
bot.hears('🚀 Project', ctx => ctx.reply(formatProjects(), { parse_mode: 'Markdown' }));
bot.hears('🛠 Keahlian', ctx => ctx.reply(formatSkills(), { parse_mode: 'Markdown' }));
bot.hears('📜 Sertifikasi', ctx => ctx.reply(formatCertifications(), { parse_mode: 'Markdown' }));
bot.hears('🎯 Target Posisi', ctx => ctx.reply(formatTargetRoles(), { parse_mode: 'Markdown' }));
bot.hears('📄 CV Lengkap', ctx => ctx.reply(formatFullCV(), { parse_mode: 'Markdown' }));

// Natural language fallback (simple keyword matching)
bot.on('text', ctx => {
  const msg = ctx.message.text.toLowerCase();
  
  const keywords = {
    tentang: ['tentang', 'profil', 'biodata', 'siapa', 'about'],
    pendidikan: ['pendidikan', 'sekolah', 'kuliah', 'university', 'gpa', 'thesis'],
    pengalaman: ['pengalaman', 'kerja', 'experience', 'job', 'aston', 'tiktok', 'madrona', 'freelance'],
    project: ['project', 'proyek', 'reservasi', 'podcast', 'thesis'],
    skill: ['skill', 'keahlian', 'teknis', 'technical', 'soft skill', 'bahasa', 'sql', 'laravel', 'linux', 'git'],
    sertifikat: ['sertifikat', 'certification', 'javascript', 'machine learning'],
    target: ['target', 'posisi', 'role', 'lamaran', 'apply', 'administration', 'operations', 'it support', 'customer service', 'data entry'],
    kontak: ['kontak', 'contact', 'nomor', 'email', 'linkedin', 'wa', 'whatsapp']
  };
  
  let matched = null;
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(w => msg.includes(w))) {
      matched = category;
      break;
    }
  }
  
  switch (matched) {
    case 'tentang': return ctx.reply(formatAbout(), { parse_mode: 'Markdown' });
    case 'pendidikan': return ctx.reply(formatEducation(), { parse_mode: 'Markdown' });
    case 'pengalaman': return ctx.reply(formatExperience(), { parse_mode: 'Markdown' });
    case 'project': return ctx.reply(formatProjects(), { parse_mode: 'Markdown' });
    case 'skill': return ctx.reply(formatSkills(), { parse_mode: 'Markdown' });
    case 'sertifikat': return ctx.reply(formatCertifications(), { parse_mode: 'Markdown' });
    case 'target': return ctx.reply(formatTargetRoles(), { parse_mode: 'Markdown' });
    case 'kontak': return ctx.reply(
      `📞 *Kontak ${cvData.name}*\n\n📱 ${cvData.phone}\n📧 ${cvData.email}\n🔗 LinkedIn: ${cvData.linkedin}\n📍 ${cvData.location}`,
      { parse_mode: 'Markdown' }
    );
    default:
      ctx.reply(
        `Maaf, saya belum paham pertanyaan itu. 🤔\n\nCoba tanyakan tentang:\n` +
        `• "Tentang saya" / "Profil"\n` +
        `• "Pendidikan / GPA / Thesis"\n` +
        `• "Pengalaman kerja / Aston / TikTok / Freelance"\n` +
        `• "Project / Podcast"\n` +
        `• "Skill / Keahlian / Laravel / SQL"\n` +
        `• "Sertifikat"\n` +
        `• "Target posisi"\n` +
        `• "Kontak"\n\nAtau ketik /help untuk daftar perintah.`,
        { parse_mode: 'Markdown', ...mainKeyboard }
      );
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ Terjadi error. Coba lagi nanti.');
});

// Launch
bot.launch()
  .then(() => console.log('✅ Bot started'))
  .catch(err => console.error('❌ Failed to start:', err));

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));