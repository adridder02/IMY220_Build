#ifndef DIRECTOR_H
#define DIRECTOR_H

#include "SystemMaker.h"
#include "TicketInformation.h"
#include "TicketSystem.h"
#include "TicketSystemMaker.h"
#include <vector>

class Director
{
private:
    // It is the system maker that will be used in the director.
    SystemMaker *maker;
    // A vector containing objects that contain ticket information that will be used to create a
    std::vector<TicketInformation *> financeTickets;
    // A vector containing objects that contain ticket information that will be used to create a tech ticket
    std::vector<TicketInformation *> techTickets;
    // A vector containing objects that contain ticket information that will be used to create a general ticket
    std::vector<TicketInformation *> generalTickets;

public:
    Director(SystemMaker *maker);
    ~Director();

    std::vector<TicketInformation *> getFinanceTickets();
    std::vector<TicketInformation *> getTechTickets();
    std::vector<TicketInformation *> getGeneralTickets();

    void setFinanceTickets(std::vector<TicketInformation *> financeTickets);
    void setTechTickets(std::vector<TicketInformation *> techTickets);
    void setGeneralTickets(std::vector<TicketInformation *> generalTickets);

    TicketSystem *construct();
};

#endif