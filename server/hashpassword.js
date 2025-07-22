const bcrypt = require('bcryptjs');

const plainPassword = 'shruti123';

bcrypt.hash(plainPassword, 10).then((hashed) => {
  console.log("🔐 Hashed password:", hashed);
});


//687fd34daf29d13c3fd806ba  //test123
//shruti123 // $2b$10$BbYpspCbYGOzIpsIFz2I2ub1dM.eCFBImIDYAssZYRisnRGyoLVcO