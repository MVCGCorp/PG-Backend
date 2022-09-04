module.exports = {
    secret: process.env.AUTH_SECRET || "pt06_pf_grupo04",
    expires: process.env.AUTH_EXPIRES || "24h",
    rounds: process.env.AUTH_ROUNDS || 10
}