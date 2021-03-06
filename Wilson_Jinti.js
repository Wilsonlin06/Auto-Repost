//Libraries
const fetch = require("node-fetch");
const FormData = require('form-data');

const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MIN = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MIN * MILLISECONDS_PER_SECOND
const TWO_DAYS_IN_MILLI = 2 * MILLISECONDS_PER_DAY

const NOT_LOGGED_IN_FLAG = 'login-link'

const USERNAME = "wilsonstorage01"
const PASSWORD = "Love9420116@"

const LOGIN_URL = 'https://passport.jinti.net/login.aspx?reurl=http%3a%2f%2fwww.jinti.net%2flife%2fuser_manage.asp'

let formData = new FormData()

formData.append('account', USERNAME)
formData.append('password', PASSWORD)
formData.append('btnLogin', '登录')

const options = {
    method: "POST",
    credentials: 'same-origin',
    body: formData
}

let cookies = ''

const ACCEPTED_COOKIES = [
    'ASPSESSIONIDSQASDBSQ', '_ga', 'ASPSESSIONIDSQASCCTR', 'ASP.NET_SessionId', 'ASPSESSIONIDSSAQDDSQ', 'ASPSESSIONIDQSQQDCAB', 'ASPSESSIONIDQSSQBCBB', 'ASPSESSIONIDSSQQBACB', 'ASPSESSIONIDSSTRBDDA', 'ASPSESSIONIDSSQTDADA', '_gid', 'ASPSESSIONIDQQSRDBCB', 'passport'
]

//TODO: Change function name to be specific to NYCHINAREN
repost = () => {
    const REPOST_URL = "http://www.jinti.net/life/user_manage.asp?channel=bizinfo&action=Refresh&id=144820"
    // "http://www.jinti.net/life/user_manage.asp?channel=bizinfo&action=Refresh&id=144810"
    // let _formData = new FormData()

    // _formData.append('m-box', 'myform')
    // _formData.append('list', 'f13')
    // _formData.append('topic_id', '144810')

    // let newOptions = {
    //     method: 'POST',
    //     body: _formData,
    //     headers: {
    //         Cookie: cookies,
    //     }
    // }
    // append(REPOST_URL)
    // .then(response => {
    //     console.log(response)
    //     return response.text()
    // })
    // .then(textResponse => {
    //     // console.log(textResponse)
    //     console.log(textResponse.includes(USERNAME))
    // })
}

//TODO: Change this to NYCHINAREN append cookies, change ACCEPTED_COOKIES
appendCookies = (_cookies) => {
    for(let i = 0; i < ACCEPTED_COOKIES.length; i++){
        if (getCookie(_cookies, ACCEPTED_COOKIES[i]) != null) {
            cookies = cookies + getCookie(_cookies, ACCEPTED_COOKIES[i]) + '; '
            console.log(cookies)
        } else {
            console.log(ACCEPTED_COOKIES[i] + " was not found")
        }
    }
    cookies = cookies.slice(0, cookies.lastIndexOf(';'))
        cookies = cookies + '; usercookie[account]=' + USERNAME + '; '
        cookies = cookies + 'passport=' + ACCEPTED_COOKIES[ACCEPTED_COOKIES.length-1] + '; '
    console.log(cookies);
}
 
getCookie = (cookieString, name) => {
    var re = new RegExp(name + "=([^;]+)")
    var value = re.exec(cookieString);
    // console.log("getCookie: ", value, unescape(value[1]))
    return (value!= null) ? unescape(value[0]) : null
}

runScript = () => {
    jinti()
   // anotherwebsite()
    setTimeout(runScript, TWO_DAYS_IN_MILLI)
}

loadPreLoginData = () => {
    //This is a login GET request, no need to pass any data, we just want the HTML
    return fetch(LOGIN_URL)
    .then((res)=>res.text())
    .then((html)=>{
        //We're looking for jinti specific data to be sent on the Login POST request
        var values = getFormHiddenValues(html)
        console.log(values)
        if (values == null || values.length == 0) {
            return null
        } else {
            for (const obj of values) {
                console.log(obj)
                formData.append(obj.key, obj.value)
            }
        }
    })
}

getFormHiddenValues = (html) => {
    let findForm = html.split('<form')
    // if (findForm < 0) {
    //     console.log("No form tag was found.")
    //     return null
    // }
    // index of the end of the <form> tag (Opening tag only)
    let formIndexBeginning = html.indexOf(findForm[1].split('\n')[0]) + findForm[1].indexOf('>') + 1
    let formIndexEnd = html.indexOf(findForm[1].split('</form>')[1]) - '</form>'.length
    let formHtml = html.substring(formIndexBeginning, formIndexEnd)
    let values = getHiddenValues(formHtml)
    return values
}

getHiddenValues = (html) => {
    var indices = [];
    var lines = html.split('\n')
    var values = [];
    for(var i=0; i<lines.length;i++) {
        if (lines[i].includes('type="hidden"')){
            let line = lines[i]
            let key = line.split('name="')[1].split('"')[0]
            let value = line.split('value')[1]
            if (value.includes('"')) value = value.split('"')[1].split('"')[0]
            else value = ""
            values.push({key, value})
            indices.push(i);
        }
    }
    return values
}



jinti = () => {
    loadPreLoginData()
    .then(() => {
        console.log(options)
        return fetch(LOGIN_URL, options).then(requestResult => {
            // for(let o of requestResult.headers) {
            //     console.log(o, o.value)
            // }
            // console.log(requestResult.headers)
            appendCookies(requestResult.headers.get("Set-Cookie"))
            return requestResult.text()
        })    
    })
    .then(textResponse => {
        if (textResponse.includes("wilsonstorage06")) {
            console.log("Login successfully")
            let newOptions = {
                credentials: 'same-origin',
                headers: {
                    Cookie: cookies,
                }
            }
            // This is to test that the session was maintained and the cookies work.
            fetch('http%3a%2f%2fwww.jinti.net%2flife%2fuser_manage.asp', newOptions)
            .then(response => response.text())
            .then(html => console.log(html.includes(USERNAME)))

            repost()

            return
        }
        console.log("Login failed")
    })
}
runScript()
