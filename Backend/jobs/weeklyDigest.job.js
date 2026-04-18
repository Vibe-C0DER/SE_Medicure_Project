import cron from 'node-cron';
import Report from '../models/report.model.js';
import User from '../models/user.model.js';
import EmailLog from '../models/emaillog.model.js';
import Disease from '../models/disease.model.js';
import sendEmail from '../utils/email.js';

export const sendWeeklyDigest = async () => {
  try {
    console.log('Running weekly digest job...');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get reports from last 7 days
    const recentReports = await Report.find({
      createdAt: { $gte: sevenDaysAgo }
    });

    if (!recentReports.length) {
      console.log('No reports found for last 7 days');
      return;
    }

    // Group reports by user
    const reportsByUser = {};
    recentReports.forEach(report => {
      const userId = report.user.toString();
      if (!reportsByUser[userId]) reportsByUser[userId] = [];
      reportsByUser[userId].push(report);
    });

    for (const userId of Object.keys(reportsByUser)) {
      const user = await User.findById(userId);
      if (!user) continue;

      // Check user preference
      if (user.emailPreferences?.weeklyDigest === false) continue;

      // Prevent duplicate emails (last 6 days)
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

      const alreadySent = await EmailLog.findOne({
        userId,
        type: 'weekly_digest',
        sentAt: { $gte: sixDaysAgo }
      });

      if (alreadySent) continue;

      const userReports = reportsByUser[userId];

      // ✅ CLEAN aggregation (ONLY topDisease)
      const diseaseCounts = {};

      userReports.forEach(report => {
        if (report.topDisease) {
          const id = report.topDisease.toString();
          diseaseCounts[id] = (diseaseCounts[id] || 0) + 1;
        }
      });

      // Get top 3 diseases
      const topDiseaseIds = Object.entries(diseaseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);

      if (!topDiseaseIds.length) {
        console.log(`No diseases found for user ${user.email}`);
        continue;
      }

      // ✅ FIXED QUERY (IMPORTANT)
      const diseases = await Disease.find({
        _id: { $in: topDiseaseIds }
      });

      // Debug (remove later)
      console.log("Top IDs:", topDiseaseIds);
      console.log("Diseases fetched:", diseases.map(d => d.name));

      // -------- EMAIL TEMPLATE --------

      // let htmlMessage = `
      //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; color:#333;">
      //     <h2 style="color:#db2777;">Your Weekly Health Summary 🩺</h2>

      //     <p>Hi ${user.firstName || 'User'},</p>

      //     <p>Here’s a summary based on your recent symptom checks:</p>

      //     <h3 style="margin-top:20px;">Top Health Conditions</h3>
      // `;
      let htmlMessage = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; color:#333; line-height:1.6;">

  <h2 style="color:#db2777; text-align:center;">🩺 Your Weekly Health Check-In</h2>

  <p>Hi ${user.firstName || 'there'},</p>

  <p>
    We hope you're doing well 💖  
    Based on your recent activity, we’ve put together a quick and simple health summary for you.
  </p>

  <p>
    This is just to help you stay aware and take better care of yourself 😊
  </p>

  <hr style="margin:20px 0;" />

  <h3 style="color:#111;">What we noticed this week:</h3>
`;

if (diseases.length === 0) {
  htmlMessage += `
    <p>
      Good news! 🎉 We didn’t notice any strong health patterns this week.  
      Keep maintaining your healthy habits — you're doing great!
    </p>
  `;
} else {
  htmlMessage += `<div style="margin-top:10px;">`;

  diseases.forEach(disease => {
    htmlMessage += `
      <div style="margin-bottom:18px; padding:12px; border:1px solid #eee; border-radius:10px; background:#fafafa;">
        <p style="margin:0; font-size:16px;">
          <strong>${disease.name}</strong>
        </p>

        ${
          disease.precautions?.length
            ? `
              <p style="margin:6px 0 0; font-size:14px; color:#555;">
                👉 Try this: ${disease.precautions.slice(0, 3).join(', ')}
              </p>
            `
            : ''
        }
      </div>
    `;
  });

  htmlMessage += `</div>`;
}

htmlMessage += `
  <hr style="margin:20px 0;" />

  <p style="font-size:14px;">
    💡 <strong>A small reminder:</strong><br/>
    This is not a medical diagnosis — just a helpful insight based on your inputs.  
    If something doesn’t feel right, please consult a doctor.
  </p>

  <p style="margin-top:20px;">
    Take care of yourself 🌿  
    <br/>
    <strong>– Team MediCure</strong>
  </p>

  <p style="font-size:12px; color:#888; margin-top:30px;">
    You’re receiving this because you enabled weekly health updates.  
    You can turn this off anytime from your profile.
  </p>

</div>
`;

     

      // -------- SEND EMAIL --------
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your Weekly Health Summary 🩺',
          message: 'Weekly health summary',
          html: htmlMessage
        });

        await EmailLog.create({
          userId: user._id,
          type: 'weekly_digest',
          sentAt: new Date()
        });

        console.log(`Email sent to ${user.email}`);
      } catch (err) {
        console.error(`Email failed for ${user.email}`, err);
      }
    }
  } catch (err) {
    console.error('Weekly digest error:', err);
  }
};


const startWeeklyDigestCron = () => {
  cron.schedule('0 9 * * 0', sendWeeklyDigest);
  console.log('Weekly digest cron running...');
};

export default startWeeklyDigestCron;