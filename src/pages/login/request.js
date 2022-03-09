import req from "../../http/httpBase.js"
export default class request extends req {
    constructor() {
        super()
    }
    /**公共 */

    //登陆
    login(params = {}) {
        return this.post("/f/pds/api/auth/login", params)
    }
}
