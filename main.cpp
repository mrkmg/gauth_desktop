#include <QApplication>
//#include <QWebInspector>
#include <QGraphicsWebView>
#include <QLayout>
#include <QDir>
#include <QWebFrame>
#include "html5applicationviewer.h"
#include "rs.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    Html5ApplicationViewer viewer;
    QWebSettings *settings = viewer.webView()->page()->settings();
    RS *rs = new RS();

    settings->setAttribute(QWebSettings::LocalStorageEnabled,true);
    settings->setOfflineStorageDefaultQuota(124000);
    settings->setOfflineWebApplicationCacheQuota(124000);
#ifdef Q_OS_LINUX
    settings->setLocalStoragePath(QDir::homePath()+"/.google_auth_app/");
    settings->setOfflineStoragePath(QDir::homePath()+"/.google_auth_app/");
    settings->setOfflineWebApplicationCachePath(QDir::homePath()+"/.google_auth_app/");
#endif
#ifdef Q_OS_WIN
    settings->setLocalStoragePath(QDir::homePath()+"/AppData/Roaming/google_auth_app/");
    settings->setOfflineStoragePath(QDir::homePath()+"/AppData/Roaming/google_auth_app/");
    settings->setOfflineWebApplicationCachePath(QDir::homePath()+"/AppData/Roaming/google_auth_app/");
#endif

    rs->addJavascript(&viewer);

    viewer.setOrientation(Html5ApplicationViewer::ScreenOrientationAuto);
    viewer.webView()->setAcceptHoverEvents(true);
    viewer.show();
    viewer.webView()->setUrl(QUrl("qrc:/html/index.html"));

    /*
    settings->setAttribute(QWebSettings::DeveloperExtrasEnabled,true);
    QWebInspector inspector;
    inspector.setPage(viewer.webView()->page());
    inspector.setVisible(true);
    */

    return app.exec();
}
