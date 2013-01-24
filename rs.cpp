#include <QGraphicsWebView>
#include <QWebFrame>
#include <QStyle>

#include "rs.h"
#include "html5applicationviewer.h"

RS::RS(QObject *parent) :
    QObject(parent)
{
}

bool RS::resize(int w, int h){
    int totalHeight = h + viewer->frameGeometry().height() - viewer->geometry().height();
    viewer->setFixedSize(w,totalHeight+3);
    return true;
}

void RS::addJavascript(Html5ApplicationViewer *v){
    viewer = v;
    viewer->webView()->page()->mainFrame()->addToJavaScriptWindowObject("RS",this);
}
