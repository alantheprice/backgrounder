(function iife() {
    Bkgdr.Setup.init(true, "dist/bkgdr.js");
    if (!Bkgdr.Statics.inWorker) {
        Bkgdr.wi.addScript("../test.js");
    }
    setTimeout(doStuff, 400);
    
    function doStuff() {
        if (Bkgdr.Statics.inWorker) {
           Bkgdr.wi.executeWithPromise("Date.now")
                .then(function(val) {
                var returnVal = "Date.now from worker: " + val;
                Bkgdr.Statics.log(returnVal);
            });
        } else {
            Bkgdr.wi.executeWithPromise("Math.random")
             .then(function(returnVal) {
               Bkgdr.Statics.log(returnVal);
            });
        }
      
    }

})();