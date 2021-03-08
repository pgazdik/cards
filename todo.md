# Model

**CardApp**
* List(Space)

**Space**
* app
* List(MainTab)

**MainTab**
* Space ownerSpace
* List(SubTab)

**SubTab**
* MainTab ownerMainTab
* List(Card)

abstract **Card**
* SubTab ownerSubTab



# USING

* https://www.npmjs.com/package/link-preview-js