#include <QGraphicsWebView>
#include <QWebFrame>
#include <QStyle>
#include <QDesktopWidget>
#include <QRect>
#include <QObject>

#include "rs.h"
#include "html5applicationviewer.h"

RS::RS(QObject *parent) :
    QObject(parent)
{
}

QObject* RS::resize(int w, int h){
    int totalHeight = h + viewer->frameGeometry().height() - viewer->geometry().height(); 
    QDesktopWidget *d = new QDesktopWidget();
    QRect ss = d->availableGeometry();
    int useHeight = totalHeight < ss.height() ? totalHeight : ss.height();
    viewer->setFixedSize(w,useHeight);
    QObject *out = new QObject();
    out->setProperty("Width",w);
    out->setProperty("Height",useHeight);
    return out;
}

void RS::addJavascript(Html5ApplicationViewer *v){
    viewer = v;
    viewer->webView()->page()->mainFrame()->addToJavaScriptWindowObject("RS",this);
}
