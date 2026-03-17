require('dotenv').config();
const { sendSMS } = require('../utils/reminderService');

async function test() {
  const recipient = '+21698115865'; // Numéro cible pour le test
  
  console.log('--- TEST DE CONFIGURATION TWILIO RÉEL ---');
  console.log(`🚀 Tentative d'envoi à : ${recipient}`);
  console.log(`📤 Depuis le numéro Twilio : ${process.env.TWILIO_WHATSAPP_NUMBER}`);

  const message = "✨ *Test MediPlus* ✨\n\nCeci est un test réel de votre plateforme de médecins. Si vous recevez ce message, la configuration Twilio est opérationnelle ! ✅";
  
  const result = await sendSMS(recipient, message);
  
  if (result.success && !result.messageId.startsWith('SIM_')) {
    console.log('\n✅ SUCCÈS RÉEL ! Le message a été transmis à Twilio.');
    console.log('SID du message :', result.messageId);
  } else if (result.success) {
    console.log('\n⚠️ Le message a été simulé. Vérifiez vos identifiants dans .env');
  } else {
    console.log('\n❌ ÉCHEC DU TEST');
    console.log('Erreur :', result.error);
  }
}

test();
