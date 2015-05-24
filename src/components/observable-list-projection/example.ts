/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    public planets = wx.list([
        { name: "Mercury", type: "rock" },
        { name: "Venus", type: "rock" },
        { name: "Earth", type: "rock" },
        { name: "Mars", type: "rock" },
        { name: "Jupiter", type: "gasgiant" },
        { name: "Saturn", type: "gasgiant" },
        { name: "Uranus", type: "gasgiant" },
        { name: "Neptune", type: "gasgiant" },
    ]);

    public typeToShow = wx.property("all");
    public filter = wx.property<string>();
    public displayAdvancedOptions = wx.property(false);

    public addPlanetCmd = wx.command((type) => {
        this.planets.push({ name: "New planet", type: type });
    }, this);

    public planetsToShow = this.planets.project(function(planet) {
        var desiredType = this.typeToShow();
        var result = desiredType === "all" || planet.type === desiredType;

        if (result && this.filter())
            result = planet.name.toLowerCase().indexOf(this.filter().toLowerCase()) !== -1;

        return result;
    }.bind(this), Rx.Observable.merge(this.typeToShow.changed, this.filter.changed));
}

export = ViewModel;