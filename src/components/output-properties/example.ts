/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    constructor() {
        var obs = Rx.Observable.timer(0, 1000)
            .select(function(x) { return 10 - x; })
            .take(11)
            .concat(Rx.Observable.return(<any> "BOOM"))
            .publish();
        
        this.countDown = obs.toProperty();
        
        this.goCmd = wx.command(function() {
            obs.connect();
        });
    }
    
    public countDown: wx.IObservableProperty<any>;
    public goCmd: wx.ICommand<any>;
}

export = ViewModel;
