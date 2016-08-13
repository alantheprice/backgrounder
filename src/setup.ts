/**
 * Setup class for Bkgdr
 */
 
module Bkgdr {
    
    export var wi:  Bkgdr.WorkerInterface;
    
    export class Setup {
        
        public static init(useWorker: boolean, workerPath?: string) {
            (<any> self).Bkgdr.wi = new Bkgdr.WorkerInterface();
            (<any> self).Bkgdr.wi.init(useWorker, workerPath);
        }
        
    }
    
    /**
     * If we are already in a webworker, we need to just initialize.
     */
    if (Statics.inWorker) {
        Setup.init(true);
    }
    
}