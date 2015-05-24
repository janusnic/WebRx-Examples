/// <reference path="../../typings/web.rx.d.ts" />

const localStorageKey = 'todos-webrx';
const displayModeAll = 'all';
const displayModeActive = 'active';
const displayModeCompleted = 'completed';

const displayModeStateKey = 'mode';
const todoStateKey = 'todo';

// represent a single todo item
class Todo {
	constructor(title: string, completed?: boolean) {
		this.title(title);
		this.completed(completed);
	}

	public title = wx.property();
	public completed = wx.property<boolean>();
	public editing = wx.property(false);
}

class ViewModel implements Rx.IDisposable {
    constructor() {
		// restore current todo and displayMode from routing-state
		this.displayMode(wx.router.current().params[displayModeStateKey] || displayModeAll);
		this.current(wx.router.current().params[todoStateKey] || "");

		var todos = localStorage[localStorageKey] ? JSON.parse(localStorage[localStorageKey]) : [];

		// map array of passed in todos to an observableArray of Todo objects
		this.todos.addRange(todos.map(todo=> new Todo(todo.title, todo.completed)));

		// we want to get notified of changes to any of the todos contained in the list
		// not just of structural changes to the list (via "listChanged" obserable).
		// Those changes are then exposed using the list's "itemChanged" obseravable
		this.todos.changeTrackingEnabled = true;
      
		// persistence
		Rx.Observable.merge(<Rx.Observable<any>> this.todos.listChanged, this.todos.itemChanged)
			.throttle(500)
			.subscribeOnNext(() => {
				localStorage[localStorageKey] = JSON.stringify(this.todos.map(x=> ({ title: x.title(), completed: x.completed() })));
		}, this);
        
		// preserve current todo and displayMode in routing-state
		this.cleanup.add(this.displayMode.changed.subscribe(dm => {
			wx.router.updateCurrentStateParams(params=> {
				params[displayModeStateKey] = dm;
			})
		}));

		this.cleanup.add(this.current.changed.subscribe(todo => {
			wx.router.updateCurrentStateParams(params=> {
				params[todoStateKey] = todo;
			})
		}));
    }

    public todos = wx.list<Todo>();
	public current = wx.property<string>();
	public displayMode = wx.property<string>(displayModeAll);
	
	// Resource cleanup
	private cleanup = new Rx.CompositeDisposable();
	
	// The framework will automatically dispose view-models that implement Rx.IDisposable
	public dispose() {
		this.cleanup.dispose();
	}

	// create a live-filtered projection of the todos collection that will update
	// when its source (this.todos) or any of its items changes or when when "displayMode" changes
	public filteredTodos = this.todos.project(todo=> {
		switch (this.displayMode()) {
			case displayModeActive:
				return !todo.completed();
			case displayModeCompleted:
				return todo.completed();
			default:
				return true;
		}
	}, this.displayMode.changed);

	// add a new entry, when enter key is pressed
	public addCmd = wx.command(() => {
		let current = this.current().trim();

		if (current) {
			this.todos.push(new Todo(current));
			this.current('');
		}
	}, this);

	// change display mode
	public changeDisplayModeCmd = wx.command(mode=> {
		this.displayMode(mode);
	}, this);

	// remove a single entry
	public removeCmd = wx.command(todo=> {
		this.todos.remove(todo);
	}, this);

	// mark all todos complete/incomplete
	public completeAllCmd = wx.command(() => {
		this.todos.forEach(todo=> {
			todo.completed(!!this.remainingCount());
		}, this);
	}, this);

	// remove all completed entries
	public removeCompletedCmd = wx.command(() => {
		this.todos.filter(todo=> {
			return todo.completed();
		}).forEach(item=> {
			this.todos.remove(item);
		}, this);
	}, this);

	// edit an item
	public editItemCmd = wx.command(item=> {
		item.editing(true);
		item.previousTitle = item.title();
	}, this);

	// cancel editing an item and revert to the previous content
	public cancelEditingCmd = wx.command(item=> {
		item.editing(false);
		item.title(item.previousTitle);
	}, this);

	// stop editing an item, remove the item, if it is now empty
	public saveEditingCmd = wx.command(item=> {
		item.editing(false);
		let title = item.title();
		let trimmedTitle = title.trim();

		if (title !== trimmedTitle) {
			item.title(trimmedTitle);
		}

		if (!trimmedTitle) {
			this.todos.remove(item);
		}
	}, this);

	// create an observable output-property representing all completed todos
	public completedCount = Rx.Observable.merge(<Rx.Observable<any>> this.todos.listChanged, this.todos.itemChanged)
		.select(this.countCompleted, this)
		.toProperty(this.countCompleted());

	// create an observable output-property representing all todos that are not complete
	public remainingCount = Rx.Observable.merge(<Rx.Observable<any>> this.todos.listChanged, this.todos.itemChanged)
		.select(this.countRemaining, this)
		.toProperty(this.countRemaining());

	private countCompleted() {
		return this.todos.filter(todo=> todo.completed()).length;
	}

	private countRemaining() {
		return this.todos.length() - this.completedCount();
	}
}

export = ViewModel;
