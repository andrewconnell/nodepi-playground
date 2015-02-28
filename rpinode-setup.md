Setup Node.js on Raspberry Pi 2 B
=================================
*These were based & inspired from this article series on [AdaFruit](http://www.adafruit.com): [Why Node.js](https://learn.adafruit.com/node-embedded-development/why-node-dot-js).*

The Raspberry Pi can have a keyboard & mouse connected via USB, a hardwired ethernet cable & HDMI cable to a monitor for everything to work... well and power. However I'd much rather work with it in a "headless" mode where all I plug in is a WiFi USB adapter & power. Then once it boots up (which is quite fast) and connected to the network (which is automatic if it sees your network from a previous configuration), you connect via SSH on the command line to do all work... so I'll show that here.

> This whole process took me less than 45 minutes, including coding up the first project: [push-button-led](push-button-led) and left me a bit excited: https://www.youtube.com/watch?v=xl2VqNwbqw8.

I used the [Raspberry Pi 2 Model B](http://www.raspberrypi.org/products/raspberry-pi-2-model-b/) for this.

Run Through Initial Config of Raspberry Pi
------------------------------------------
No need to repeat this... see [this to get going](http://www.raspberrypi.org/help/quick-start-guide/). I specifically used the Raspbian OS, specifically **Debian Wheezy** that you can get form [Raspberry Pi Downloads](http://www.raspberrypi.org/downloads/).

Run through the setup... it's quick once you have the OS on the memory card. I did all this with a computer setup (USB mouse, keyboard, HDMI cable to external monitor).

### Setup WiFi
I used the [Edimax EW-7811Un 150Mbps 11n WiFi USB Adapter](http://www.amazon.com/gp/product/B003MTTJOY/ref=oh_aui_detailpage_o00_s01?ie=UTF8&psc=1). Once you plug it in, within the Raspbian GUI (get to it from a command line by running `startx`) open the WiFi settings. You have to manually find your network SSID, select it and enter the password. Then reboot the Pi... (from the terminal: `sudo reboot`)... when it reboots you should be online.

To be safe, grab the IP of the Pi. Now you can go headless.

Setup Host Computer
-------------------
First, make sure your host (laptop) is setup. 

### Get Network Scanner to Find the Pi
You'll need to find your Pi on your network if its headless and you don't know it's IP. I used [nmap](https://en.wikipedia.org/wiki/Nmap). On MacOS this is available via homebrew:

````
$ brew install nmap
````

Find your Raspberry Pi
----------------------
To use it, from the command line, tell it to scan your network for machines with port 22 open (the SSH port):

````
$ nmap -p 22 --open -sV 192.168.0.* -Pn
````

> The above says *scan my network, specifically all IPs on 192.168.0.any that have port 22 open.* The last argument isn't required but I had to do it.

You are looking for a response that includes **OpenSSH 6.0p1 Debian**... that's Raspbian Wheezy so it's likely our Pi. Near that line, a few lines above it, it should say the actual IP it was scanning when it got that. Here's what mine said:

````
$ nmap -p 22 --open -sV 192.168.0.* -Pn

Starting Nmap 6.47 ( http://nmap.org ) at 2015-02-28 09:47 EST
Nmap scan report for 192.168.0.104
Host is up (0.0056s latency).
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 6.0p1 Debian 4+deb7u2 (protocol 2.0)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at http://nmap.org/submit/ .
Nmap done: 255 IP addresses (3 hosts up) scanned in 3.39 seconds
````

Now you know your IP... mine is **192.168.0.104**.

Connect to the Raspberry Pi
---------------------------
Now that you know the IP of your Pi, connect to it using SSH. There are clients you can use (on Windows, get [PuTTY](http://www.putty.org/)), but I'm doing it via terminal on MacOS so I can just do the following:

````
$ ssh pi@192.168.0.104
````

> The above says *connect to 192.168.0.104 over SSH, which is port 22, and try to login as the user **pi** *.

You'll be prompted to login, so enter your password.

You should now be logged in as the prompt should look something like:

````
pi@raspberry ~ $
````

Update the Raspberry Pi
-----
Before installing Node.js, make sure the Pi is current by running these two commands:

````
pi@raspberry ~ $ sudo apt-get update
pi@raspberry ~ $ sudo apt-get upgrade
````

Install Node.js
----
Now get the latest stable node.js package available from the node-arm site:

````
pi@raspberry ~ $ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
````

After downloading the package, install it:

````
pi@raspberry ~ $ sudo dpkg -i node_latest_armhf.deb
````

This takes a while so be patient... once it finishes, verify it's installed:

````
pi@raspberry ~ $ node -v
````

Now that Node.js is installed you're done... unless you want to work with the GPIO ports on the device... and I did!

Enable GPIO For the Pi User
----
You MAY not need this, but I did just to be safe...

Get the [GPIO Admin](https://github.com/quick2wire/quick2wire-gpio-admin):

````
pi@raspberry ~ $ git clone git://github.com/quick2wire/quick2wire-gpio-admin.git ~/gpio-admin && cd ~/gpio-admin
````

Once you downloaded the source, build it:

````
pi@raspberry ~ $ make
````

> You should already be in the `gpio-admin` folder after downloading it with `git`... if not you need to be before running the `make` command above.

Now install what you just built:

````
pi@raspberry ~ $ sudo make install
````

And finally, grant the user **pi** to the GPIO ports...

````
pi@raspberry ~ $ sudo adduser pi gpio
````

And then, refresh the experience by either rebooting (`sudo reboot`) or reload the terminal shell (`exec su -l pi`).

All done!