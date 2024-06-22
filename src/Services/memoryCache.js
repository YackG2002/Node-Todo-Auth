let cache = {};

const get = (key) => {
    return cache[key];
};

const set = (key, value, duration) => {
    const expiryDate = new Date().getTime() + duration * 60000;
    cache[key] = { value, expiryDate };
};

const invalidate = (key) => {
    delete cache[key];
};

const validateCacheEntry = () => {
    const currentTime = new Date().getTime();
    for (let key in cache) {
        if (cache[key].expiryDate < currentTime) {
            delete cache[key]; // Supprimez les entrées expirées
        }
    }
};

setInterval(validateCacheEntry, 60000); // Nettoyez le cache toutes les 10 minutes

module.exports = { get, set, invalidate };