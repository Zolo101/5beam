import fs from "fs";
import mariadb from "mariadb";
import chalk from "chalk";

const cred = fs.readFileSync("dbcred.txt").toString("utf8").split("\n")
export const pool = mariadb.createPool({
    host: cred[0].trim(),
    port: Number(cred[1].trim()),
    user: cred[2].trim(),
    password: cred[3].trim(),
    database: cred[4].trim()
});
console.log(chalk.greenBright("Connected to MYSQL Database!"))

function initDatabase(): void {
    // enter init code here
}

export async function getAllLevels(): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `ID`, `name`, `author`, `description`, `date`, `version` FROM `5beam`");
    } finally {
        if (conn) conn.release();
    }
}


export async function getLevel(id: string): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT * FROM `5beam` WHERE ID = ?", [id]);
    } finally {
        if (conn) conn.release();
    }
}

export async function getLevelData(id: string): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `data` FROM `5beam` WHERE ID = ?", [id]);
    } finally {
        if (conn) conn.release();
    }
}

export async function getPage(number: number, pagesize = 8): Promise<string> {
    console.log(number * pagesize, (number + 1) * (pagesize))
    let conn;
    try {
        conn = await pool.getConnection();
        // eslint-disable-next-line no-param-reassign
        return await conn.query("SELECT * FROM `5beam` LIMIT ? OFFSET ?", [pagesize, number * pagesize]);
    } finally {
        if (conn) conn.release();
    }
}


export async function postLevelData(level: any): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("INSERT INTO `5beam` (name, author, description, date, data, version) value (?, ?, ?, ?, ?, ?)",
            [level.name, level.author, level.description, Date.now(), JSON.stringify(level.levels), level.struct_version]);
    } finally {
        if (conn) conn.release();
    }
}

export default initDatabase;