var express = require('express');
var router = express.Router();
var Realm = require('../realm.js');
var memberDefault = ["강성민", "김나은", "김성호", "김아현", "김태헌", "김태형", "배세준", "조성훈"];
var members = memberData();
/* GET users listing. */
router.post('/', function(req, res, next) {

    var name = req.body.name;
    console.log("name", name);
    console.log("members", members);
    if(members.indexOf(name) == -1){
        return res.send({
            msg: name + "은(는) 멤버가 아닙니다."
        })
    }

    var manito = Realm.ManitoRealm
        .objects('Manito')
        .filtered(`name = "${name}"`);
    
    if(manito && manito[0]){
        return res.send({
            msg: "이미 뽑으셨군요. " + name + "님의 마니또는 " + manito[0].first + ", " + manito[0].second + " 입니다."
        });
    }
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var picked = pickManito(name);
    var manitoData = {
        id: getPrimaryKeyId(Realm.ManitoRealm, 'Manito'),
        name: name,
        ip: ip,
        first: picked.first,
        second: picked.second,
        date: new Date()
    };
    
    Realm.ManitoRealm.write(() => {
        Realm.ManitoRealm.create('Manito', manitoData);
    });

    manitoData.msg = `당신의 마니또는 ${manitoData.first}, ${manitoData.second} 입니다.`;
    
    res.send(manitoData);
});

router.get('/reset', function(req, res, next) {
    Realm.MemberRealm.write(() => {
        Realm.MemberRealm.deleteAll();
    });

    Realm.ManitoRealm.write(() => {
        Realm.ManitoRealm
            .deleteAll();
    });

    res.send({msg:'reset done'});
    
});

function memberData(data){
    var member = Realm.MemberRealm.objects("Member");
    if(data){
        //set
        if(member && member[0]){
            Realm.MemberRealm.write(() => {
                Realm.MemberRealm.create('Member', {
                    id: member[0].id,
                    data: data
                }, true);
            });
            
        }else{
            Realm.MemberRealm.write(() => {
                Realm.MemberRealm.create('Member', {
                    id: 1,
                    data: data
                });
            });
        }
        return data;
    }else{
        //get
        if(member && member[0]){
            return Array.prototype.slice.call(member[0].data);
        }else{
            var memberData = shuffleArray(memberDefault);
            Realm.MemberRealm.write( () => {
                Realm.MemberRealm.create('Member', {
                    id: 1,
                    data: memberData
                });
            });
            
            return memberData;
        }
    }
}
    
function pickManito(name){
    console.log("[ pickMnito ]");
    var firstIdx, secondIdx
    var idx = members.indexOf(name);
        
    firstIdx = (idx + 1) % members.length;
    secondIdx = (idx + 2) % members.length;

    console.log("[pickManito] memberData", memberData());

    return {
        first: members[firstIdx],
        second: members[secondIdx]
    };
    
}

function getPrimaryKeyId(realmInstance, model) {
    if (realmInstance.objects(model).max("id")) {
        return realmInstance.objects(model).max("id") + 1;
    }
    return 1;
}

function shuffleArray(_array) {
    var array = _array.slice();
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

module.exports = router;
