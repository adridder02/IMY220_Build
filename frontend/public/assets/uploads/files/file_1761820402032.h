#ifndef FINANCECOMMAND_H
#define FINANCECOMMAND_H

#include "TicketCommand.h"

class FinanceCommand : public TicketCommand {
public:
    FinanceCommand();

    void execute(std::string id, std::string info) override;
    
    std::string getType() override;
};

#endif