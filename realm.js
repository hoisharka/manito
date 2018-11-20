var Realm = require('realm');

let ManitoSchema = {
    name : 'Manito',
    primaryKey: 'id',
    properties : {
        id : 'int',
        name : 'string',
        ip : 'string',
        first : 'string',
        second : 'string',
        date : 'date'
    }
};

let MemberSchema = {
    name: 'Member',
    primaryKey: 'id',
    properties: {
        id: 'int',
        data: 'string[]'
    }
}

var ManitoRealm = new Realm({
    path : 'manito.realm',
    schema : [ManitoSchema]
});

var MemberRealm = new Realm({
    path : 'memeber.realm',
    schema : [MemberSchema]
});


module.exports = {
    ManitoRealm : ManitoRealm,
    MemberRealm : MemberRealm
};

