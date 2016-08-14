/**
 * Setup class for Bkgdr
 */
 
module Bkgdr {
    
    export var wi:  Bkgdr.WorkerInterface;

    export var config: Config;
    
    export var init = (useWorker: boolean, options?: Config) => {
            config = options || {};
            (<any> self).Bkgdr.wi = new WorkerInterface();
            (<any> self).Bkgdr.wi.init(useWorker, config.workerPath);
        };

    /**
     * If we are already in a webworker, we need to just initialize.
     */ 
    if (Utils.inWorker) {
        init(true);
        // here we are giving our worker the ability to call functions against the main thread. 
        self.document = <any> {};
        self.window = <any> {};
        self.console = <any> self.console || {};
        addFunctionsToObj("console", true);
        addFunctionsToObj("document", config.hideWorkerWarning);
        addFunctionsToObj("window", config.hideWorkerWarning);
    }

    function addFunctionsToObj(objName: string, hideWorkerWarning: boolean) {
        wi.executeWithPromise("Bkgdr.Utils.getFunctionNamesFromObj", [objName])
            .then(funcNames => {
                funcNames.forEach(obj => {
                    addFunctionToObj(objName, obj.name, hideWorkerWarning)
                });
                console.log(funcNames.map(obj => {return obj.argLength;})
                .reduce((a, b) => { return Math.max(a, b);}));
            });
    }

    function addFunctionToObj(objName: string, functionName: string, hideWorkerWarning: boolean) {
        self[objName][functionName] = (p1, p2, p3, p4) => {
            if (!hideWorkerWarning) {
                console.log("You are calling the function: "
                    + functionName + " on a copy of the " + objName + " in the context of a webworker."
                    + "It may not behave as you expect: Note: all return values are returned in Promises and must be serializable.");
            }
            var name = objName + "." + functionName;
            return wi.execute(name, [p1, p2, p3, p4]);                                               
        };
    }

    export interface Config {
        workerPath?: string;
        hideWorkerWarning?: boolean;
    }
    
}