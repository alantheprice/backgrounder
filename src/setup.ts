/**
 * Setup class for Bkgdr
 */
 
module Bkgdr {
    
    export var wi:  Bkgdr.WorkerInterface;

    export var config: Config = {};

    export var restrictedProperties: string[] = ["window", "document", "console", "location", "navigator", "localStorage", "sessionStorage"];
    
    export var init = (useWorker: boolean, options?: Config) => {
            config = options || {};
            (<any> self).Bkgdr.wi = new WorkerInterface();
            (<any> self).Bkgdr.wi.init(useWorker);
            if (Utils.inWorker) {
                (<any>self).getProperty = (baseObjName, propName) => {
                    return wi.executeWithPromise("getProperty", [baseObjName, propName]);
                };
            } else {
                (<any>self).getProperty = (baseObjName, propName) => {
                    return Promise.resolve(self[baseObjName][propName]);
                };
            }
        };

    /**
     * If we are already in a webworker, we need to just initialize.
     */ 
    export var setupConfig = (options: Config) => {
        config = options;
        config.bootstrapWindowContext = (config.bootstrapWindowContext !== false) ? true : false;
        if (Utils.inWorker) {
            if (config.bootstrapWindowContext) {
                restrictedProperties.forEach(name => {
                    addFunctionsToObj(name);
                });
            }
        }
    }

    if(Utils.inWorker) {
        init(true);
    }

    function addFunctionsToObj(objName: string) {
        // adding prop to global context.
        self[objName] = self[objName] || {};

        wi.executeWithPromise("Bkgdr.Utils.getPropertyNamesFromObj", [objName])
            .then((props: IProperties) => {
                props.funcNames.forEach(name => {
                    addFunctionToObj(objName, name)
                });
                props.propNames.forEach(name => {
                    var msg = "Property: " + name + " not available on: " 
                        + objName + " in a worker. If property is serializable, you can use `getProperty('" +objName + "', '" + name + "').then(...)`";
                    if (objName === "window") {
                        // often a property or function will exist within the worker global context, adding to the "fake-window" if available.
                        self[objName][name] = self[objName][name] || self[name] || msg;
                    } else {
                        self[objName][name] = self[objName][name] || msg;
                    }
                
                });
            });
    }

    function addFunctionToObj(objName: string, functionName: string) {
        var hideWorkerWarning = (objName === "console" || config.hideWorkerWarning);

        if (self[objName][functionName]) {
            // function already exists in a worker, don't overwrite.
            return;
        }
        self[objName][functionName] = (p1, p2, p3, p4) => {
            if (objName !== "console" && !config.hideWorkerWarning) {
                console.warn("You are calling the function: " + objName + "."
                    + functionName + " on a copy of the " + objName + " in the context of a webworker."
                    + "It may not behave as expected");
            }
            var name = objName + "." + functionName;
            if (functionName === "getItem") {
                return wi.executeWithPromise(name, [p1, p2, p3, p4]);
            }
            return wi.execute(name, [p1, p2, p3, p4]);                                               
        };

        // add subprops to window to keep things easy.
        if (objName !== "window") {
            window[objName] = self[objName];
        }
    }

    export interface Config {
        workerPath?: string;
        hideWorkerWarning?: boolean;
        bootstrapWindowContext?: boolean;
    }
    
}