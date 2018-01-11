const csv = require('csvtojson')
var fs  = require('fs')
var chunk = require('lodash.chunk');
import async from 'async'
import request from 'superagent'

const csvPath = './Migrated_Accounts.csv'

var json = {
  "jsonArray": []
}

csv()
  .fromFile(csvPath)
  .on('json',(jsonObj)=>{
    var obj2 = JSON.stringify(jsonObj)
    json.jsonArray.push(obj2)

  	// combine csv header row and csv line to a json object
  	// jsonObj.a ==> 1 or 4
  })
  .on('done',(error)=>{
    var ch = chunk(json.jsonArray, 5)
    var url = ''
    var x = ch.map((chunk) => {
      return JSON.stringify({"jsonArray": chunk})
    })
    // .forEach((file, i) => {
    //   fs.writeFile(`insertme-${i}`, file, (err) => console.log(err))
    // })
    async.each(x, function(app, callback){
      
      request.post()
      .send(app)
      .end((err, res) => {
        if (err){
          callback(`${app} failed to process`)
        }
        // Calling the end function will send the request
        console.log('');
        callback();
      });
    }, function(err){
      if(err) console.log('application failed to process')

      console.log('all files have been processed')
    })

  })
