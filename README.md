BrainStorm
---

HackISU 09/2016

##### Description:
BrainStorm is a web-app designed to help those who want to learn connect with those who can teach them.


##### Database Entity Spec:

```
Session:

{
    id: int
    name: str
    topic: str
    latlng: {lat: float, lng: float}
    members: [arr of user ids]
    distance: float
}
```