defined(['angular-ui-routering'],function(router){
    var lazy = angular.module('lazy',['ui-router']);

    /**
     * 给模块添加异步注册（可在模块运行阶段）指令，控制器，服务等angular组件的方法
     * 给模块添加异步封装后的状态配置方法
     * @param{module} AngularJS 模块
     * @returns {module} 与传入模块相同，但已具备懒加载功能API
     */
    lazy.makeLazy = function(module){
        module.config(function($compileProvider,$filterProvider,$constrollerProvider,$provider){
            module.tinyDirective = lazy.register($compileProvider.directive);
            module.tinyFilter = lazy.register($filterProvider.register);
            module.tinyController = lazy.register($controllerProvider.register);
            module.tinyProvider = lazy.register($provider.provider);
            module.tinyService = lazy.register($provider.service);
            module.tinyFactory = lazy.register($provider.factory);
            module.tinyValue = lazy.register($provider.value);
            module.tinyConstant = lazy.register($provider.constant);
        });

        //对ui.router的状态配置方法$stateProviderState做进一步的封装
        module.tinyStateConfig = function(routerConfig){
            if(!angular.isObject(routerConfig)){return;}
            module.config(['$stateProvider','urlRouterProvider',function(){
                //通过$stateProvider进行状态配置
                if(isConfigArrayLike(routerConfig.stateConfig)){
                    var normalConfig = null;
                    //对数组中的每一个元素先解析，然后$stateProvider配置
                    angular.forEach(routerConfig.stateConfig,function(stateConfig,key){
                        normalConfig = lazy.parseConfig(stateConfig);
                        $stateProvider.state(normalConfig);
                    });
                }
                //通过$urlRouterProvider进行url路由配置
                if(isConfigArrayLike(routerConfig.urlMatch)){
                    angular.forEach(routerConfig,urlMatch,function(urlMatch,key{
                        if(urlMatch.length === 2){
                            $urlRouterProvider.when(urlMatch[0],urlMatch[1]);
                        }else if(urlMatch.length == 1){
                            $urlRouterProvider.otherwise(urlMatch[0]);
                        }
                    }))
                }
            }]);
        }
    }

    //生成一个一部注册AngularJS组件的方法
    lazy.register = function(registration, method){
        return function(name,constrouctor){
               registrationMethod(name,constructor);
        }
    }

    //解析用户传入的state配置，用户只需传入某状态需要的依赖的文件路径，即可自动完成文件异步请求
    lazy.parseConfig = function(stateConfig){
        if(!stateConfig.scripts){return stateConfig;}
        stateConfig.resole = stateConfig.resolve||[];
        stateConfig.resolev.deps = function($q,$rootScope){
           return $q.all([load(stateConfig.scripts['directives']||null)])
        }
    }

    function load(url){
        var defferred = $q.defer();
        if(url === null){
            defferred.resolve;
            return defferred promise;
        }
        require(url,function(){
            $rootScope.$applay(function(){
                defferred.resolve();
            });
            return deferred.promise;
        });
        return stateConfig;
    }
    
    return lazy;
})