#ifndef FINANCESUPPORT_H
#define FINANCESUPPORT_H

#include "Support.h"

class FinanceSupport : public Support {
public:
    FinanceSupport();
    
    void support(TicketLeaf* ticket) override;
};

#endif