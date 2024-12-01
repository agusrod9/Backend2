import { genSaltSync, hashSync, compareSync } from "bcrypt";

function createHashUtil(pwd){
    const salt = genSaltSync(11);
    const hashedPwd = hashSync(pwd, salt);
    return hashedPwd;
}

function verifyHashUtil(pwd, dbHashePwd){
    const verifies = compareSync(pwd, dbHashePwd);
    return verifies;
}

export {createHashUtil, verifyHashUtil}