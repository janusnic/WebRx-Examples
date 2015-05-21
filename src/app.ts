/// <reference path="typings/web.rx.d.ts" />
/// <reference path="typings/require.d.ts" />

requirejs.config({
    baseUrl: "/",
    paths: {
        'text': 'js/text'
    }
});

// register animations
wx.app.animation('move-to-right-unfold-left-enter', wx.animation("pt-page-rotateUnfoldRight stopped", "running", undefined));
wx.app.animation('move-to-right-unfold-left-leave', wx.animation("pt-page-moveToLeftFade stopped", "running", undefined));

wx.app.animation('push-bottom-from-top-enter', wx.animation("pt-page-moveFromTop stopped", "running", undefined));
wx.app.animation('push-bottom-from-top-leave', wx.animation("pt-page-rotatePushBottom stopped", "running", undefined));

wx.app.animation('scale-down-from-top-enter', wx.animation("pt-page-moveFromTop pt-page-ontop stopped", "running", undefined));
wx.app.animation('scale-down-from-top-leave', wx.animation("pt-page-scaleDown stopped", "running", undefined));

wx.app.animation('fadeIn', wx.animation("fadeIn stopped", "running", undefined));
wx.app.animation('fadeOut', wx.animation("fadeOut stopped", "running", undefined));

// register components
wx.app.component('state-monitor', {
    viewModel: <wx.IComponentViewModelDescriptor> <any> { require: "js/components/state-monitor/ViewModel" },
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/state-monitor/index.html" }
});

wx.app.component('header', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/header/index.html" }
});

wx.app.component('state-monitor', {
    viewModel: <wx.IComponentViewModelDescriptor> <any> { require: "js/components/state-monitor/ViewModel" },
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/state-monitor/index.html" }
});

wx.app.component('header', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/header/index.html" }
});

wx.app.component('welcome', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/welcome/index.html" }
});

// setup root state
wx.router.state({
    name: "$",
    views: {
        'main': {
            component: "welcome",
            animations: {
                enter: "move-to-right-unfold-left-enter",
                leave: "move-to-right-unfold-left-leave"
            }
        },
        'state': {
            component: "state-monitor",
            animations: {
                enter: "fadeIn",
                leave: "fadeOut"
            }
        },
        'header': "header"
    }
});

interface IExample {
    title: string;
    folder: string;
    hasViewModel: boolean;
}

var examples:Array<IExample> = [
    { title: "Hello World", folder: "hello", hasViewModel: false },
];

// configure examples
examples.forEach(function (x) {
    if (x.hasViewModel) {
        wx.app.component(x.folder, {
            viewModel: <wx.IComponentViewModelDescriptor> <any> { require: wx.formatString("js/components/{0}/ViewModel", x.folder) },
            template: <wx.IComponentTemplateDescriptor> <any> { require: wx.formatString("text!/components/{0}/index.html", x.folder) }
        });
    }
    else {
        wx.app.component(x.folder, {
            template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/hello/index.html" }
        });
    }
    wx.router.state({
        name: x.folder,
        views: {
            'main': {
                component: x.folder,
                animations: {
                    enter: "push-bottom-from-top-enter",
                    leave: "push-bottom-from-top-leave"
                }
            }
        }
    });
});

// setup binding properties
this.currentExampleIndex = wx.property(0);
this.currentExample = wx.whenAny(this.currentExampleIndex, cei=> examples[cei]).toProperty();

this.nextExampleCmd = wx.command(param=> {
    var index = this.currentExampleIndex();
    
    wx.router.go(examples[index].folder, {}, { location: wx.RouterLocationChangeMode.add });
    
    if(index + 1 < examples.length - 1)
        index++;
    else
        index = 0;
        
    this.currentExampleIndex(index);
}, this);

// go
var syncUrl = wx.getSearchParameters()["rs"];

if(!syncUrl) {
    wx.router.go("$", {}, { location: wx.RouterLocationChangeMode.replace });
} else {
    wx.router.sync((<wx.IRoute> wx.router.get("$").url).stringify() + syncUrl);
}

wx.applyBindings(this);
