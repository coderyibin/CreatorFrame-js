echo 'start hot update';

cd ../

node version_generator.js -v 1.10.091 -u http://pet.tianyaso.com/gameUpdate/Sagittary/remote-assets/ -s build/jsb-link -d build/jsb-link/

echo 'end hot update'
