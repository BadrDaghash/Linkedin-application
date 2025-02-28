import cron from "node-cron"
import OTP from "../../DB/models/otp/otp.model.js"


cron.schedule("0 */6 * * *" , async ()=>{
   
  try {
    const now = new Date()
    const result = await OTP.deleteMany({expiresAt :{$lt : now }})
    console.log(`${result.deletedCount} expired OTPs deleted.`);

  } catch (error) {
    console.error("Error deleting expired OTPs:", error);

  }
})