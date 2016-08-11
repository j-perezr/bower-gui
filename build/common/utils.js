var DeepMerge = require('deep-merge');

var deepmerge = DeepMerge(function(target, source, key) {
    if(target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});
function config(defaults,overrides) {
    return deepmerge(defaults, overrides || {});
}

module.exports = {
    getConfig:config
};