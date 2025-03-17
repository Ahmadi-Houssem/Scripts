/*

    This file is a simple implementation of the reactivity system in Vue.js
    It uses the Proxy object to create a reactive object that will call functions when a prop changes

*/


//Object that will be passed to the reactive function
let player:object = {
    hp: 100,
    stamina:10,
    isAlive: false,
    name:'unknow player'
};

//Map will be containing props as keys and an array of functions to be called when prop changes, as a value
const player_react_map:Map<string, object> = new Map();

const player_handler = {
    get(target:object, prop:any) {
        console.log(prop+' was accessed')
        return target[prop];
    },
    set(target:object, prop:any, value:any) {
        console.log(prop+' is updating from '+target[prop]+' to '+value)
        if((prop == 'hp' || prop == 'stamina') && typeof value != 'number') {
            console.log("type not supported");
            return true;
        }
        target[prop] = value;
        compute(prop);
        return true;
    }
};

function reactive(target:object, handler:object):any {
    return new Proxy(target, handler);
}

//used to add functions to be called when prop changes
function update_player_map(prop:any, fn:Function) {
    if(player_react_map.has(prop)) {
        player_react_map.get(prop).push(fn);
    } else {
        player_react_map.set(prop, [fn]);
    }
}

//used to call functions when prop changes
function compute(prop:string) {
    if(player_react_map.has(prop)) {
        player_react_map.get(prop).forEach((fn:Function) => {
            fn();
        });
    } else {
        console.log("Prop: "+prop+" not found in the map");
        player_react_map.set(prop, []);
        console.log("Prop: "+prop+" added to the map");
    }
}

///////////////////////////////////// testing /////////////////////////////////////

//Functions that will be called when the player.hp is updated
function fn1() {
    if(new_player.hp <= 0) {
        new_player.isAlive = false;
        console.log("Player is dead");
    } else {
        new_player.isAlive = true;
        console.log("Player is alive");
    }
}

function fn2() {
    console.log("fn2 here");
}
///////////////////////////////////////////////

let new_player = reactive(player, player_handler);
player_react_map.set("hp", [fn1])
update_player_map('hp', fn2);

new_player.hp = -200;