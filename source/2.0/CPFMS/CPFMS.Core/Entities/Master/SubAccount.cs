using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Master
{
	public class SubAccount : IdNameBaseEntity
	{
		public string Address { get; set; }
		public string Remark { get; set; }
		public int AccountId { get; set; }
	}

	public class SubAccountDetails : BaseEntity
	{
		public int SubAccountId { get; set; }
		public int OrganizationId { get; set; }
		public int ResourcePersonId { get; set; }

		// Cow Details
		public int CowCastId { get; set; }
		public DateOnly IssueDate { get; set; }
		public DateOnly BirthDate { get; set; }
		public decimal BirthWeight { get; set; }
		public DateOnly JoinDate { get; set; }
		public decimal JoinWeight { get; set; }
		public DateOnly HeiferDate { get; set; }
		public DateOnly CalwingDate { get; set; }
		public decimal CalwingLiter { get; set; }
		public DateOnly CancelDate { get; set; }
		public DateOnly DeathDate { get; set; }

		// SubAccount Balance Details
		public decimal OpeningBalance { get; set; }
		public string OpeningBalanceType { get; set; }
		public decimal ClosingBalance { get; set; }
		public string ClosingBalanceType { get; set; }
		public decimal CRAmount { get; set; }
		public decimal DRAmount { get; set; }

		// Insurance Details
		public DateOnly Date { get; set; }
		public DateOnly DueOnDate { get; set; }
		public string TagNo { get; set; }
		public decimal Amount { get; set; }
	}
}
