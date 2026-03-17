const Appointment = require('../models/Appointment');
const Cabinet = require('../models/Cabinet');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');

let twilio;
try {
  twilio = require('twilio');
} catch (e) {
  console.log('Twilio package not installed yet.');
}

/**
 * Fonction pour envoyer une notification WhatsApp réelle via Twilio
 */
const sendSMS = async (telephone, message, options = {}) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (accountSid && authToken && fromNumber && twilio) {
      const client = twilio(accountSid, authToken);
      
      let formattedTo = telephone.trim().replace(/\s/g, '');
      if (!formattedTo.startsWith('+')) {
        if (formattedTo.startsWith('00')) {
          formattedTo = '+' + formattedTo.substring(2);
        } else {
          if (formattedTo.length === 8 && /^[2459]/.test(formattedTo)) {
            formattedTo = '+216' + formattedTo;
          } else {
            formattedTo = '+' + formattedTo;
          }
        }
      }

      const to = `whatsapp:${formattedTo}`;
      const from = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;

      // Préparation de l'envoi
      const messageData = { from, to };
      
      if (options.templateSid) {
        // Mode Production : Utilise un Template Sid Twilio
        messageData.contentSid = options.templateSid;
        if (options.contentVariables) {
          messageData.contentVariables = JSON.stringify(options.contentVariables);
        }
      } else {
        // Mode Test/Standard : Envoi de texte libre
        messageData.body = message;
      }

      console.log(`📡 Envoi WhatsApp vers ${formattedTo} (${options.templateSid ? 'Template' : 'Texte libre'})`);

      const response = await client.messages.create(messageData);
      return { success: true, messageId: response.sid };
    }
    
    // Simulation si non configuré
    return { success: true, messageId: `SIM_${Date.now()}` };
  } catch (error) {
    console.error('❌ Echec Twilio:', error.message);
    return { success: false, error: error.message };
  }
};

// Vérifier et envoyer les rappels 24h avant
const check24hReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: { $gte: tomorrow, $lte: tomorrowEnd },
      statut: 'confirme',
      rappelEnvoye24h: false
    }).populate('patientId').populate('cabinetId');

    for (const appointment of appointments) {
      const cabinet = appointment.cabinetId;
      if (!cabinet.rappelsActives || !cabinet.rappel24h) continue;

      const patient = appointment.patientId;
      if (!patient) continue;

      const message = `🔔 *Rappel de Consultation*\n\nBonjour *${patient.prenom} ${patient.nom}*, c'est un petit rappel pour votre rendez-vous de demain avec le *Dr. ${cabinet.nom}*.\n\n📅 *Demain à ${appointment.heure}*\n📍 *Lieu* : ${cabinet.adresse}\n\nNous avons hâte de vous recevoir ! ✨`;

      const result = await sendSMS(patient.telephone, message);

      await Notification.create({
        type: 'whatsapp',
        destinataire: patient.telephone,
        message,
        appointmentId: appointment._id,
        cabinetId: cabinet._id,
        statut: result.success ? 'envoye' : 'echec',
        dateEnvoi: new Date(),
        erreur: result.success ? null : result.error
      });

      if (result.success) {
        appointment.rappelEnvoye24h = true;
        await appointment.save();
      }
    }
    console.log(`✅ Rappels 24h vérifiés: ${appointments.length} RDV`);
  } catch (error) {
    console.error('Erreur rappels 24h:', error);
  }
};

// Vérifier et envoyer les rappels 2h avant
const check2hReminders = async () => {
  try {
    const now = new Date();
    // On cherche les rendez-vous d'aujourd'hui
    const startOfDay = new Date(now.setHours(0,0,0,0));
    const endOfDay = new Date(now.setHours(23,59,59,999));

    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      statut: 'confirme',
      rappelEnvoye2h: false
    }).populate('patientId').populate('cabinetId');

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    for (const appointment of appointments) {
      const cabinet = appointment.cabinetId;
      if (!cabinet.rappelsActives || !cabinet.rappel2h) continue;

      const patient = appointment.patientId;
      if (!patient) continue;

      // Parser l'heure (format "HH:mm")
      const [aptHour, aptMinute] = appointment.heure.split(':').map(Number);
      
      // Calculer la différence en minutes
      const nowInMinutes = currentHour * 60 + currentMinute;
      const aptInMinutes = aptHour * 60 + aptMinute;
      const diff = aptInMinutes - nowInMinutes;

      // Si le rendez-vous est dans moins de 125 minutes et plus de 115 minutes (fenêtre de 10 min autour de 2h)
      if (diff <= 125 && diff >= 115) {
        const message = `🕒 *À tout de suite !*\n\nBonjour *${patient.prenom} ${patient.nom}*, votre rendez-vous avec le *Dr. ${cabinet.nom}* commence dans *2 heures* (à *${appointment.heure}*).\n\nÀ très bientôt ! 🙏`;

        const result = await sendSMS(patient.telephone, message);

        await Notification.create({
          type: 'whatsapp',
          destinataire: patient.telephone,
          message,
          appointmentId: appointment._id,
          cabinetId: cabinet._id,
          statut: result.success ? 'envoye' : 'echec',
          dateEnvoi: new Date(),
          erreur: result.success ? null : result.error
        });

        if (result.success) {
          appointment.rappelEnvoye2h = true;
          await appointment.save();
        }
      }
    }
    console.log(`✅ Rappels 2h vérifiés`);
  } catch (error) {
    console.error('Erreur rappels 2h:', error);
  }
};

module.exports = {
  sendSMS,
  check24hReminders,
  check2hReminders
};
