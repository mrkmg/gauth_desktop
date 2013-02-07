#ifndef RS_H
#define RS_H

#include <QObject>
#include "html5applicationviewer.h"

class RS : public QObject
{
    Q_OBJECT
public:
    explicit RS(QObject *parent = 0);
    void addJavascript(Html5ApplicationViewer *v);
private:
    Html5ApplicationViewer *viewer;
    
signals:
    
public slots:
    QObject* resize(int w, int h);
    
};

#endif // RS_H
