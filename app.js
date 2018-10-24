
const express = require('express')
const multer = require('multer')
const app = express()
const PORT = process.env.PORT || 3000;

var Datastore = require('nedb')

const storage =  multer.diskStorage({
  destination: './public/files',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const uploader = multer({ storage })

app.set('view engine', 'pug')

var db = {};
db.images = new Datastore({ 
    filename: 'public/db/images.db'
});

db.images.loadDatabase();

app.get('/', (req, res) => {

  db.images.find({},
    function(err, result){
      console.log(result);
      var lists = [];
      result.forEach(function(val,index){
        lists.push(val._id);
      });
      res.render('index', {
        'name': 'Masaya',
        'content': 'Limited Uploader',
        'lists':lists
      });
      console.log(lists);
    }
  )
});

app.get('/:id',(req,res) => {
  db.images.find({_id:req.params.id},
    function(err, result){
      console.log(result);
      if(result.length > 0){
        console.log("found");
        console.log(result[0].file.filename);
        res.render('singleview',{'imgsrc':result[0].file.filename});
      }else{
        console.log("can not find");
      }
    }
  );
})

app.post('/images', uploader.single('image'), (req, res) => {
  const file = req.file
  const meta = req.body
  // デッバグのため、アップしたファイルの名前を表示する
  console.log(file, meta)

  db.images.insert({file: file});

  // アップ完了したら200ステータスを送る
  res.status(200).json({msg: 'アップロード完了'})
})

app.use(express.static('public'))
app.listen(3000, () => console.log('Listening on port 3000'))
