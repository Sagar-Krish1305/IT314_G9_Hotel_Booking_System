import multer from "multer";

const storage = multer.diskStorage({
<<<<<<< Updated upstream
  destination: function (req, file, cb) {
    cb(null, "./assets")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({
  storage
=======
    destination: function (req, file, cb) {
      cb(null, "./assets")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
  })
  
export  const upload = multer({ 
  storage 
>>>>>>> Stashed changes
})