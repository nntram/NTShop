using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using NTShop.Entities;
using NTShop.Models.StatisticsModels;

namespace NTShop.Data
{
    public partial class NIENLUANContext : DbContext
    {
        public NIENLUANContext()
        {
        }

        public NIENLUANContext(DbContextOptions<NIENLUANContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Brand> Brands { get; set; } = null!;
        public virtual DbSet<Cart> Carts { get; set; } = null!;
        public virtual DbSet<Cartdetail> Cartdetails { get; set; } = null!;
        public virtual DbSet<Category> Categories { get; set; } = null!;
        public virtual DbSet<Customer> Customers { get; set; } = null!;
        public virtual DbSet<District> Districts { get; set; } = null!;
        public virtual DbSet<Invoice> Invoices { get; set; } = null!;
        public virtual DbSet<Invoicedetail> Invoicedetails { get; set; } = null!;
        public virtual DbSet<Order> Orders { get; set; } = null!;
        public virtual DbSet<Orderdetail> Orderdetails { get; set; } = null!;
        public virtual DbSet<Orderstatus> Orderstatuses { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;
        public virtual DbSet<Productimage> Productimages { get; set; } = null!;
        public virtual DbSet<Province> Provinces { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<Supplier> Suppliers { get; set; } = null!;
        public virtual DbSet<Ward> Wards { get; set; } = null!;
        public virtual DbSet<Warehousereceipt> Warehousereceipts { get; set; } = null!;
        public virtual DbSet<Warehousereceiptdetail> Warehousereceiptdetails { get; set; } = null!;
        public virtual DbSet<staff> staff { get; set; } = null!;
        public virtual DbSet<ProductStatisticsModel> ProductStatisticsModels { get; set; }
        public virtual DbSet<InvoiceStatisticsModel> InvoiceStatisticsModels { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=WINDOWS\\NGOCTRAM;Initial Catalog=NIENLUAN;Integrated Security=True");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.Brandid)
                    .IsClustered(false);

                entity.Property(e => e.Brandid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Brandcreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");
            });

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasKey(e => e.Cartid)
                    .IsClustered(false);

                entity.Property(e => e.Cartid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Cartquantity).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Carts)
                    .HasForeignKey(d => d.Customerid)
                    .HasConstraintName("FK_CART_CUSTOMER__CUSTOMER");
            });

            modelBuilder.Entity<Cartdetail>(entity =>
            {
                entity.Property(e => e.Cartdetailid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Cartdetailprice).HasDefaultValueSql("((0))");

                entity.Property(e => e.Cartdetailquantity).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Cart)
                    .WithMany(p => p.Cartdetails)
                    .HasForeignKey(d => d.Cartid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CARTDETA_CARTDETAI_CART");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Cartdetails)
                    .HasForeignKey(d => d.Productid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CARTDETA_CARTDETAI_PRODUCT");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Categoryid)
                    .IsClustered(false);

                entity.Property(e => e.Categoryid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Categorycreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Customerid)
                    .IsClustered(false);

                entity.Property(e => e.Customerid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Customercreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");

                entity.HasOne(d => d.Ward)
                    .WithMany(p => p.Customers)
                    .HasForeignKey(d => d.Wardid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CUSTOMER_CUSTOMER__WARD");
            });

            modelBuilder.Entity<District>(entity =>
            {
                entity.HasKey(e => e.Districtid)
                    .HasName("PK_PROVINCE")
                    .IsClustered(false);

                entity.Property(e => e.Districtid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Province)
                    .WithMany(p => p.Districts)
                    .HasForeignKey(d => d.Provinceid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PROVINCE_PROVINCE__DISTRICT");
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.Invoiceid)
                    .IsClustered(false);

                entity.Property(e => e.Invoiceid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Invoicecreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.Customerid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_INVOICE_CUSTOMER__CUSTOMER");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.Orderid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_INVOICE_ORDER_INV_ORDER");

                entity.HasOne(d => d.Staff)
                    .WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.Staffid)
                    .HasConstraintName("FK_INVOICE_STAFF_INV_STAFF");
            });

            modelBuilder.Entity<Invoicedetail>(entity =>
            {
                entity.Property(e => e.Invoicedetailid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Invoice)
                    .WithMany(p => p.Invoicedetails)
                    .HasForeignKey(d => d.Invoiceid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_INVOICED_INVOICEDE_INVOICE");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Invoicedetails)
                    .HasForeignKey(d => d.Productid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_INVOICED_INVOICEDE_PRODUCT");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Orderid)
                    .IsClustered(false);

                entity.Property(e => e.Orderid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Ordercode).ValueGeneratedOnAdd().Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore); 

                entity.Property(e => e.Ordercreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");

                entity.Property(e => e.Orderstatusid).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.Customerid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ORDER_CUSTOMER__CUSTOMER");

                entity.HasOne(d => d.Orderstatus)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.Orderstatusid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ORDER_ORDER_STA_ORDERSTA");

                entity.HasOne(d => d.Staff)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.Staffid)
                    .HasConstraintName("FK_ORDER_STAFF_ORD_STAFF");
            });

            modelBuilder.Entity<Orderdetail>(entity =>
            {
                entity.Property(e => e.Orderdetailid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.Orderdetails)
                    .HasForeignKey(d => d.Orderid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ORDERDET_ORDERDETA_ORDER");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Orderdetails)
                    .HasForeignKey(d => d.Productid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ORDERDET_ORDERDETA_PRODUCT");
            });

            modelBuilder.Entity<Orderstatus>(entity =>
            {
                entity.HasKey(e => e.Orderstatusid)
                    .IsClustered(false);

                entity.Property(e => e.Orderstatusid).HasDefaultValueSql("(newid())");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Productid)
                    .IsClustered(false);

                entity.Property(e => e.Productid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Productcode).ValueGeneratedOnAdd().Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore); 

                entity.Property(e => e.Productcreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");

                entity.HasOne(d => d.Brand)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.Brandid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PRODUCT_PRODUCT_B_BRAND");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.Categoryid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PRODUCT_CATEGORY__CATEGORY");
            });

            modelBuilder.Entity<Productimage>(entity =>
            {
                entity.HasKey(e => e.Productimageid)
                    .IsClustered(false);

                entity.Property(e => e.Productimageid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Productimages)
                    .HasForeignKey(d => d.Productid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PRODUCTI_PRODUCT_I_PRODUCT");
            });

            modelBuilder.Entity<Province>(entity =>
            {
                entity.HasKey(e => e.Provinceid)
                    .HasName("PK_DISTRICT")
                    .IsClustered(false);

                entity.Property(e => e.Provinceid).HasDefaultValueSql("(newid())");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Roleid)
                    .IsClustered(false);

                entity.Property(e => e.Roleid).HasDefaultValueSql("(newid())");
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.HasKey(e => e.Supplierid)
                    .IsClustered(false);

                entity.Property(e => e.Supplierid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Suppliercreacteddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01 00:00:00',getutcdate()))");

                entity.HasOne(d => d.Ward)
                    .WithMany(p => p.Suppliers)
                    .HasForeignKey(d => d.Wardid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SUPPLIER_SUPLIER_W_WARD");
            });

            modelBuilder.Entity<Ward>(entity =>
            {
                entity.HasKey(e => e.Wardid)
                    .IsClustered(false);

                entity.Property(e => e.Wardid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.District)
                    .WithMany(p => p.Wards)
                    .HasForeignKey(d => d.Districtid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WARD_WARD_PROV_PROVINCE");
            });

            modelBuilder.Entity<Warehousereceipt>(entity =>
            {
                entity.HasKey(e => e.Warehousereceiptid)
                    .IsClustered(false);

                entity.Property(e => e.Warehousereceiptid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Warehousereceiptcreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");

                entity.HasOne(d => d.Staff)
                    .WithMany(p => p.Warehousereceipts)
                    .HasForeignKey(d => d.Staffid)
                    .HasConstraintName("FK_WAREHOUS_STAFF_WRR_STAFF");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.Warehousereceipts)
                    .HasForeignKey(d => d.Supplierid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WAREHOUS_SUPPLIER__SUPPLIER");
            });

            modelBuilder.Entity<Warehousereceiptdetail>(entity =>
            {
                entity.Property(e => e.Wrdetailid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Warehousereceiptdetails)
                    .HasForeignKey(d => d.Productid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WAREHOUS_WAREHOUSE_PRODUCT");

                entity.HasOne(d => d.Warehousereceipt)
                    .WithMany(p => p.Warehousereceiptdetails)
                    .HasForeignKey(d => d.Warehousereceiptid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WAREHOUS_WAREHOUSE_WAREHOUS");
            });

            modelBuilder.Entity<staff>(entity =>
            {
                entity.HasKey(e => e.Staffid)
                    .IsClustered(false);

                entity.Property(e => e.Staffid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Staffcreateddate).HasDefaultValueSql("(datediff_big(millisecond,'1970-01-01',getutcdate()))");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.staff)
                    .HasForeignKey(d => d.Roleid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_STAFF_STAFF_ROL_ROLE");
            });
            modelBuilder.Entity<ProductStatisticsModel>(entity =>
            {
                entity.HasNoKey();
            });
            modelBuilder.Entity<InvoiceStatisticsModel>(entity =>
            {
                entity.HasNoKey();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
