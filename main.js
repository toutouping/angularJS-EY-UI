/**
 * config of requireJS
 * [paths description]
 * @type {Object}
 */
require.config({
    paths: {
        'framework': ['./framework/framework']
    }
});

require(['framework'], function(framework) {
    angular.bootstrap(document, [framework.name]);
});
