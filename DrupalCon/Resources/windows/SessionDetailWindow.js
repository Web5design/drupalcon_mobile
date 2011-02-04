
(function() {

  DrupalCon.ui.createSessionDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      nid: '',
      tabGroup: undefined
    });

    var sessionDetailWindow = Titanium.UI.createWindow({
      id: 'sessionDetailWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    if (Ti.Platform.name == 'android') {
      var itemWidth = Ti.UI.currentWindow.width - 40;
    }
    else {
      var itemWidth = sessionDetailWindow.width - 40;
    }
    

    // Build session data
    var sessionData = Drupal.entity.db('main', 'node').load(settings.nid);

    // Build presenter data
    var presenterData = [];
    var sessionInstructors = sessionData.instructors;
    // Instructors may be single (string) or multiple (object), this part works.
    var instructors = [];
    if (typeof sessionInstructors === 'string') {
      instructors.push(sessionInstructors);
    }
    else {
      instructors = sessionInstructors;
    }

    for(var i in instructors) {
      var rows = Drupal.db.getConnection('main').query("SELECT data,full_name FROM user WHERE name = ?", [instructors[i]]);
      while (rows.isValidRow()) {
        presenterData.push({
          'data': JSON.parse(rows.fieldByName('data')),
          'fullName': rows.fieldByName('full_name')
        });
        rows.next();
      }
      rows.close();
    }

    // Build the page:
    var tvData = [];
    var tv = Ti.UI.createTableView({
      minRowHeight: 50,
      textAlign: 'left',
      borderColor:"#fff"
    });
    var row = Ti.UI.createTableViewRow({height:'auto',className:"row",borderColor:"#fff", bottom: 10});

    var textView = Ti.UI.createView({
      height: 'auto',
      layout: 'vertical',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    });

    var titleLabel = Ti.UI.createLabel({
      text:cleanSpecialChars(sessionData.title),
      font:{fontSize: 24, fontWeight: 'bold'},
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      height: 'auto',
      width: itemWidth
    });
    textView.add(titleLabel);

    for (var i in presenterData) {
      var presenterName = Ti.UI.createLabel({
        text: presenterData[i].fullName,
        backgroundColor: '#fff',
        font:{fontSize: 18, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#000',
        height: 'auto',
        width: itemWidth
      });
      textView.add(presenterName);
    }

    var room = Ti.UI.createLabel({
      text: cleanSpecialChars(sessionData.room),
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      top: 10,
      width: itemWidth,
      height: 'auto'
    });
    textView.add(room);


    var body = Ti.UI.createLabel({
      text:sessionData.body,
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:20,
      bottom:10,
      width:itemWidth,
      height:'auto'
    });
    textView.add(body);

    var presentersLabel = Ti.UI.createLabel({
      text:"Presenters",
      backgroundColor:'#fff',
      font:{fontSize: 18, fontWeight: 'bold'},
      textAlign:'left',
      color:'#000',
      top:20,
      bottom:10,
      width:itemWidth,
      height:'auto'
    });
    textView.add(presentersLabel);
    row.add(textView);
    tvData.push(row);

    var presenterName2 = [];
    var presenterFullName2 = [];
    var presRow = [];

    for (var i in presenterData) {
      presRow[i] = Ti.UI.createTableViewRow({
        height:80,
        uid:presenterData[i].data.uid,
        name:presenterData[i].data.name,
        data:presenterData[i],
        className:"row",
        borderColor:'#fff',
        hasChild:true,
        leftImage:'images/default-profile-pic.png'
      });
      presenterFullName2[i] = Ti.UI.createLabel({
        text:presenterData[i].fullName,
        uid:presenterData[i].data.uid,
        name:presenterData[i].data.name,
        data:presenterData[i],
        font:{fontSize:18, fontWeight:'bold'},
        left: 85,
        top: 10,
        right: 15,
        height: 'auto'
      });
      presenterName2[i] = Ti.UI.createLabel({
        text:presenterData[i].data.name,
        uid:presenterData[i].data.uid,
        name:presenterData[i].data.name,
        data:presenterData[i],
        font:{fontSize:14, fontWeight:'normal'},
        left: 85,
        color:"#999",
        top: 30,
        right: 15,
        height: 'auto'
      });

      presRow[i].addEventListener('click', function(e) {
        if (Ti.Platform.name == 'android') {
          var currentTab = Titanium.UI.currentTab;
        }
        else {
          var currentTab = sessionDetailWindow.tabGroup.activeTab;
        }
        currentTab.open(DrupalCon.ui.createPresenterDetailWindow({
          title: e.source.name,
          uid: e.source.uid,
          name: e.source.name,
          data: e.source.data,
          tabGroup: Titanium.UI.currentTab
        }), {animated:true});
      });
      
      presRow[i].add(presenterFullName2[i]);
      presRow[i].add(presenterName2[i]);
      tvData.push(presRow[i]);

    }

    var row3 = Ti.UI.createTableViewRow({height:'auto',className:"row",borderColor:"#fff"});

    var textViewBottom = Ti.UI.createView({
      height: 'auto',
      layout: 'vertical',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      left: 10,
      right: 10
    });

    var audienceTitle = Ti.UI.createLabel({
      text:"Intended Audience",
      backgroundColor:'#fff',
      textAlign:'left',
      font:{fontSize:18, fontWeight:'bold'},
      color:'#000',
      top:20,
      width:itemWidth,
      height:'auto'
    });
    textViewBottom.add(audienceTitle);

    var audience = Ti.UI.createLabel({
      text:sessionData.audience,
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:10,
      width:itemWidth,
      height:'auto'
    });
    textViewBottom.add(audience);

    row3.add(textViewBottom);



    tvData.push(row3);
    tv.setData(tvData);

    sessionDetailWindow.add(tv);


    return sessionDetailWindow;
  };

})();

