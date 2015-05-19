const http = require('http')
const router = require('routes')()
const level = require('level')
const sublevel = require('level-sublevel')
const db = sublevel(level('allyourbase.db', {valueEncoding: 'json'}))
const userdb = db.sublevel('users')

userdb.batch(require('./fakeusers.json'), function(err) {
  if (err) console.error(err)
})

router.addRoute('/get/user/:id', function (req, res, params) {
  userdb.get(params.id, function(err, value) {
    var buf = new Buffer(JSON.stringify(value))
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Content-Length", buf.length)
    res.end(buf)
  })
})

var server = http.createServer( function (req, res) {
  var match = router.match(req.url)
  if (match) match.fn(req, res, match.params)
  else res.end('<a href="http://localhost:9090/get/user/1">first fake user!</a> <a href="http://localhost:9090/get/user/2">second fake user!</a> <a href="http://localhost:9090/get/user/3">third fake user!</a>' )
})

server.listen(9090, function() {
  console.log("server running at http://localhost:9090")
})
