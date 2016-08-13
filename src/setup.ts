/**
 * Setup class for Bkgdr
 */
 
module Bkgdr {
    
    export var wi:  Bkgdr.WorkerInterface;
    
    export var init = (useWorker: boolean, workerPath?: string) => {
            (<any> self).Bkgdr.wi = new WorkerInterface();
            (<any> self).Bkgdr.wi.init(useWorker, workerPath);
        };
 
    /**
     * If we are already in a webworker, we need to just initialize.
     */ 
    if (Utils.inWorker) {
        init(true);
    }
    
}