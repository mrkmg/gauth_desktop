# Add more folders to ship with the application, here
#folder_01.source = html
#folder_01.target = .
#DEPLOYMENTFOLDERS = folder_01

# Define TOUCH_OPTIMIZED_NAVIGATION for touch optimization and flicking
#DEFINES += TOUCH_OPTIMIZED_NAVIGATION

symbian:TARGET.UID3 = 0xE654FA24

# Allow network access on Symbian
symbian:TARGET.CAPABILITY += NetworkServices

ICON = GoogleAuth.icns

# Smart Installer package's UID
# This UID is from the protected range and therefore the package will
# fail to install if self-signed. By default qmake uses the unprotected
# range value if unprotected UID is defined for the application and
# 0x2002CCCF value if protected UID is given to the application
#symbian:DEPLOYMENT.installer_header = 0x2002CCCF

# If your application uses the Qt Mobility libraries, uncomment the following
# lines and add the respective components to the MOBILITY variable.
# CONFIG += mobility
# MOBILITY +=

# The .cpp file which was generated for your project. Feel free to hack it.
SOURCES += main.cpp \
    appextend.cpp

# Please do not modify the following two lines. Required for deployment.
include(html5applicationviewer/html5applicationviewer.pri)
qtcAddDeployment()

RESOURCES += \
    files.qrc

OTHER_FILES += \
    html/Catull.ttf \
    html/storage.js \
    html/sha.js \
    html/jquery.js \
    html/index.html \
    html/jquery.color.js \
    html/googleauth.js \
    GoogleAuth.rc \
    html/main.js \
    html/main.css

HEADERS += \
    appextend.h

RC_FILE = GoogleAuth.rc
