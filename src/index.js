import './index.css'
import './less.less'
import './sass.scss'



let pm = require('../assets/pm.png')

console.log(pm);
let img = new Image()
img.src = pm.default
document.body.appendChild(img)